// Batterie de tests (lois W-13) : garde la publication, tourne avant la
// génération. Pas de réseau, pas d'écriture de fichier, quelques secondes max.
'use strict';
const assert = require('assert');
const { DATA_PATH, build } = require('./generate.js');
const fs = require('fs');
const { appliquer } = require('./scripts/postuler-issue.js');

// Statuts de candidature (scripts/postuler-issue.js), sur un jeu de données
// fictif : aucune lecture ni écriture de fichier.
function testPostuler() {
  function jeu() {
    return { offres: [
      { id: 'a', archive: false },
      { id: 'b', archive: true },
      { id: 'c', archive: false, candidature_status: 'preparee' },
      { id: 'd', archive: false, candidature_status: 'envoyee' }
    ] };
  }
  function offre(d, id) { return d.offres.find(function (o) { return o.id === id; }); }
  let cas = 0;
  function verifie(condition, libelle) { cas += 1; assert.ok(condition, 'postuler : ' + libelle); }

  let d = jeu();
  let r = appliquer(d, { action: 'opened', titre: 'postuler: a' });
  verifie(r.changed && offre(d, 'a').candidature_status === 'demandee', 'ouverture -> demandee');
  r = appliquer(d, { action: 'opened', titre: 'postuler: a' });
  verifie(!r.changed && offre(d, 'a').candidature_status === 'demandee', 'seconde ouverture sans effet');

  d = jeu();
  r = appliquer(d, { action: 'opened', titre: 'postuler: b' });
  verifie(!r.changed && !('candidature_status' in offre(d, 'b')), 'offre archivee refusee');
  r = appliquer(d, { action: 'opened', titre: 'postuler: inconnue' });
  verifie(!r.changed && r.id === '', 'offre introuvable refusee, id non renvoye');
  r = appliquer(d, { action: 'opened', titre: 'archiver: a' });
  verifie(!r.changed, 'titre qui ne commence pas par postuler refuse');
  assert.deepStrictEqual(d, jeu(), 'postuler : un refus ne modifie aucune donnee');

  d = jeu();
  r = appliquer(d, { action: 'closed', titre: 'postuler: c', raison: 'completed' });
  verifie(r.changed && offre(d, 'c').candidature_status === 'envoyee', 'fermeture terminee -> envoyee');
  r = appliquer(d, { action: 'closed', titre: 'postuler: c', raison: 'not_planned' });
  verifie(!r.changed && offre(d, 'c').candidature_status === 'envoyee', 'une candidature envoyee ne s\'annule pas');

  d = jeu();
  r = appliquer(d, { action: 'closed', titre: 'postuler: c', raison: 'not_planned' });
  verifie(r.changed && !('candidature_status' in offre(d, 'c')), 'fermeture non planifiee -> statut retire');
  d = jeu();
  r = appliquer(d, { action: 'closed', titre: 'postuler: c', raison: '' });
  verifie(!r.changed && offre(d, 'c').candidature_status === 'preparee', 'fermeture sans motif sans effet');

  d = jeu();
  r = appliquer(d, { action: 'dispatch', id: 'a', statut: 'preparee' });
  verifie(r.changed && offre(d, 'a').candidature_status === 'preparee', 'lancement manuel -> preparee');
  r = appliquer(d, { action: 'dispatch', id: 'a', statut: 'aucun' });
  verifie(r.changed && !('candidature_status' in offre(d, 'a')), 'lancement manuel aucun -> statut retire');
  r = appliquer(d, { action: 'dispatch', id: 'a', statut: 'nimporte' });
  verifie(!r.changed, 'statut invalide refuse');
  r = appliquer(d, { action: 'dispatch', id: 'b', statut: 'preparee' });
  verifie(!r.changed, 'lancement manuel sur offre archivee refuse');
  r = appliquer(d, { action: 'autre', titre: 'postuler: a' });
  verifie(!r.changed, 'action inconnue refusee');

  return cas;
}

function run() {
  const raw = fs.readFileSync(DATA_PATH, 'utf8');
  const data = JSON.parse(raw);

  assert.ok(Array.isArray(data.offres) && data.offres.length > 0,
    'data/offres.json doit contenir au moins une offre');

  const ids = new Set();
  data.offres.forEach(function (o) {
    assert.ok(o.id, 'offre sans id : ' + JSON.stringify(o));
    assert.ok(!ids.has(o.id), 'id en doublon : ' + o.id);
    ids.add(o.id);
    assert.ok(o.titre, 'offre sans titre : ' + o.id);
    assert.ok(o.entreprise, 'offre sans entreprise : ' + o.id);
    assert.ok(['85', '44', 'autre'].includes(o.region), 'region invalide : ' + o.id);
    assert.ok(o.url && /^https?:\/\//.test(o.url), 'url invalide : ' + o.id);
    assert.ok(typeof o.archive === 'boolean', 'archive doit etre un booleen : ' + o.id);
    if (o.archive) {
      assert.ok(o.archive_motif, 'offre archivee sans motif : ' + o.id);
    }
    if (o.candidature_status) {
      assert.ok(['demandee', 'preparee', 'envoyee'].includes(o.candidature_status),
        'candidature_status invalide : ' + o.id);
    }
  });

  const b = build(data);
  assert.strictEqual(b.activeCount + b.archiveCount, data.offres.length,
    'actives + archivees doit egaler le total');

  console.log('OK : ' + data.offres.length + ' offres valides, ' +
    b.activeCount + ' actives, ' + b.archiveCount + ' archivees.');

  const cas = testPostuler();
  console.log('OK : statuts de candidature, ' + cas + ' cas verifies.');
}

try {
  run();
} catch (e) {
  console.error('ECHEC DES TESTS : ' + e.message);
  process.exit(1);
}

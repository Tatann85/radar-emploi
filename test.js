// Batterie de tests (lois W-13) : garde la publication, tourne avant la
// génération. Pas de réseau, pas d'écriture de fichier, quelques secondes max.
'use strict';
const assert = require('assert');
const { DATA_PATH, build, archiveVisible } = require('./generate.js');
const fs = require('fs');
const { appliquer } = require('./scripts/postuler-issue.js');
const { appliquerArchive } = require('./scripts/archive-issue.js');

// Archivage et restauration (scripts/archive-issue.js), et règle des 30 jours
// (generate.js). Jeu de données fictif : aucune lecture ni écriture de fichier.
function testArchive() {
  function jeu() {
    return { offres: [
      { id: 'a', archive: false, archive_motif: null },
      { id: 'b', archive: true, archive_motif: 'Hors profil.', archive_date: '2026-10-01' }
    ] };
  }
  function offre(d, id) { return d.offres.find(function (o) { return o.id === id; }); }
  let cas = 0;
  function verifie(condition, libelle) { cas += 1; assert.ok(condition, 'archive : ' + libelle); }
  const J = '2026-10-12';

  let d = jeu();
  let r = appliquerArchive(d, { titre: 'archiver: a', corps: 'Demande envoyée depuis le site en un clic.', aujourdhui: J });
  verifie(r.changed && offre(d, 'a').archive === true && offre(d, 'a').archive_date === J, 'un clic archive et date');
  verifie(offre(d, 'a').archive_motif === 'Archivée depuis le site le ' + J + '.', 'motif par défaut en un clic');
  r = appliquerArchive(d, { titre: 'archiver: a', corps: '', aujourdhui: J });
  verifie(!r.changed, 'seconde archive sans effet');

  d = jeu();
  r = appliquerArchive(d, { titre: 'archiver: a', corps: 'Motif (optionnel), à remplacer avant de valider :\n\nTrop loin.', aujourdhui: J });
  verifie(offre(d, 'a').archive_motif === 'Trop loin.', 'motif saisi conservé');

  d = jeu();
  r = appliquerArchive(d, { titre: 'restaurer: b', corps: '', aujourdhui: J });
  verifie(r.changed && offre(d, 'b').archive === false && !('archive_date' in offre(d, 'b')) &&
    offre(d, 'b').archive_motif === null, 'restauration');
  r = appliquerArchive(d, { titre: 'restaurer: b', corps: '', aujourdhui: J });
  verifie(!r.changed, 'seconde restauration sans effet');

  d = jeu();
  r = appliquerArchive(d, { titre: 'archiver: inconnue', corps: '', aujourdhui: J });
  verifie(!r.changed && r.id === '', 'offre introuvable refusée');
  r = appliquerArchive(d, { titre: 'postuler: a', corps: '', aujourdhui: J });
  verifie(!r.changed, 'titre étranger refusé');
  assert.deepStrictEqual(d, jeu(), 'archive : un refus ne modifie aucune donnée');

  const o = { archive: true, archive_date: '2026-10-01' };
  verifie(archiveVisible(o, '2026-10-30'), 'visible au 29e jour');
  verifie(!archiveVisible(o, '2026-10-31'), 'retirée du site au 30e jour');
  verifie(archiveVisible({ archive: false }, '2030-01-01'), 'une offre active est toujours visible');

  return cas;
}

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

  d = jeu();
  r = appliquer(d, { action: 'opened', titre: 'envoyee: c' });
  verifie(r.changed && offre(d, 'c').candidature_status === 'envoyee', 'bouton envoye -> envoyee');
  r = appliquer(d, { action: 'closed', titre: 'envoyee: c', raison: 'not_planned' });
  verifie(!r.changed && offre(d, 'c').candidature_status === 'envoyee', 'fermeture d\'une demande envoyee sans effet');

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
      assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(o.archive_date || ''),
        'offre archivee sans date d\'archivage : ' + o.id);
    }
    if (o.candidature) {
      ['lettre', 'note_cv', 'dossier'].forEach(function (k) {
        assert.ok(/^https:\/\/drive\.google\.com\//.test(o.candidature[k] || ''),
          'lien de dossier invalide (' + k + ') : ' + o.id);
      });
    }
    if (o.candidature_status) {
      assert.ok(['demandee', 'preparee', 'envoyee', 'refusee', 'entretien'].includes(o.candidature_status),
        'candidature_status invalide : ' + o.id);
    }
  });

  const b = build(data);
  assert.strictEqual(b.activeCount + b.archiveCount + b.masqueeCount, data.offres.length,
    'actives + archivees affichees + archivees retirees du site doit egaler le total');

  console.log('OK : ' + data.offres.length + ' offres valides, ' +
    b.activeCount + ' actives, ' + b.archiveCount + ' archivees.');

  const cas = testPostuler();
  console.log('OK : statuts de candidature, ' + cas + ' cas verifies.');
  const casArchive = testArchive();
  console.log('OK : archivage et regle des 30 jours, ' + casArchive + ' cas verifies.');
}

try {
  run();
} catch (e) {
  console.error('ECHEC DES TESTS : ' + e.message);
  process.exit(1);
}

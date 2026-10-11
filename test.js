// Batterie de tests (lois W-13) : garde la publication, tourne avant la
// génération. Pas de réseau, pas d'écriture de fichier, quelques secondes max.
'use strict';
const assert = require('assert');
const { DATA_PATH, build } = require('./generate.js');
const fs = require('fs');

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
}

try {
  run();
} catch (e) {
  console.error('ECHEC DES TESTS : ' + e.message);
  process.exit(1);
}

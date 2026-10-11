// Traite une issue "archiver: <id>" créée depuis le bouton 🗄 du site.
// Lu par .github/workflows/archive-issue.yml. Aucune dépendance externe.
'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'offres.json');

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  if (file) fs.appendFileSync(file, name + '=' + value + '\n');
}

function main() {
  const title = process.env.ISSUE_TITLE || '';
  const body = process.env.ISSUE_BODY || '';
  const m = title.match(/^archiver:\s*(.+)$/i);
  if (!m) {
    console.log('Titre inattendu, rien à faire : ' + title);
    setOutput('changed', 'false');
    return;
  }
  const id = m[1].trim();
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const offre = data.offres.find(function (o) { return o.id === id; });
  if (!offre) {
    console.log('Offre introuvable : ' + id);
    setOutput('changed', 'false');
    setOutput('id', id);
    return;
  }
  if (offre.archive) {
    console.log('Déjà archivée : ' + id);
    setOutput('changed', 'false');
    setOutput('id', id);
    return;
  }
  var motif = body
    .replace('Motif (optionnel), à remplacer avant de valider :', '')
    .trim();
  offre.archive = true;
  offre.archive_motif = motif || 'Archivée depuis le site le ' + new Date().toISOString().slice(0, 10) + '.';
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Archivée : ' + id);
  setOutput('changed', 'true');
  setOutput('id', id);
}

main();

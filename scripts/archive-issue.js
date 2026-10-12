// Traite une demande "archiver: <id>" ou "restaurer: <id>" venue du site
// (bouton 🗄 ou ↩, en un clic avec la clé du navigateur, ou par la page GitHub).
// Lu par .github/workflows/archive-issue.yml. Aucune dépendance externe.
//
// Une offre archivée reste dans data/offres.json avec sa date d'archivage :
// le site l'affiche dans l'onglet Archives pendant 30 jours, puis ne l'affiche
// plus (generate.js), mais la veille sait toujours qu'elle a été écartée.
'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = process.env.OFFRES_PATH ||
  path.join(__dirname, '..', 'data', 'offres.json');

const PROMPT_MOTIF = 'Motif (optionnel), à remplacer avant de valider :';
const CORPS_UN_CLIC = 'Demande envoyée depuis le site en un clic.';

function refus(message) {
  return { changed: false, id: '', action: '', message: message };
}

function motifDepuisCorps(corps) {
  const texte = String(corps || '')
    .replace(PROMPT_MOTIF, '')
    .replace(CORPS_UN_CLIC, '')
    .trim();
  return texte || null;
}

// Fonction pure : ne lit ni n'écrit aucun fichier, ne va pas sur le réseau.
// demande = { titre, corps, aujourdhui: 'AAAA-MM-JJ' }
function appliquerArchive(data, demande) {
  const m = String(demande.titre || '').match(/^(archiver|restaurer):\s*(.+)$/i);
  if (!m) return refus('Titre inattendu, rien à faire.');
  const action = m[1].toLowerCase();
  const id = m[2].trim();
  const offre = (data.offres || []).find(function (o) { return o.id === id; });
  if (!offre) return refus('Offre introuvable, aucune modification.');

  if (action === 'archiver') {
    if (offre.archive) return refus('Offre déjà archivée, aucune modification.');
    offre.archive = true;
    offre.archive_motif = motifDepuisCorps(demande.corps) ||
      'Archivée depuis le site le ' + demande.aujourdhui + '.';
    offre.archive_date = demande.aujourdhui;
    return { changed: true, id: offre.id, action: action,
      message: 'Offre archivée : elle reste 30 jours dans l\'onglet Archives du site.' };
  }

  if (!offre.archive) return refus('Offre déjà active, aucune modification.');
  offre.archive = false;
  offre.archive_motif = null;
  delete offre.archive_date;
  return { changed: true, id: offre.id, action: action,
    message: 'Offre restaurée : elle revient dans la liste des offres actives.' };
}

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  const propre = String(value).replace(/[\r\n]+/g, ' ');
  if (file) fs.appendFileSync(file, name + '=' + propre + '\n');
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const res = appliquerArchive(data, {
    titre: process.env.ISSUE_TITLE || '',
    corps: process.env.ISSUE_BODY || '',
    aujourdhui: new Date().toISOString().slice(0, 10)
  });
  if (res.changed) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  console.log(res.message + (res.id ? ' (' + res.id + ')' : ''));
  setOutput('changed', res.changed ? 'true' : 'false');
  setOutput('id', res.id);
  setOutput('action', res.action);
  setOutput('message', res.message);
}

if (require.main === module) {
  main();
}

module.exports = { appliquerArchive: appliquerArchive, motifDepuisCorps: motifDepuisCorps };

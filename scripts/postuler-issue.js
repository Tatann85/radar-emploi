// Traite une demande "postuler: <id>" créée depuis le bouton ✉ du site.
// Lu par .github/workflows/postuler-issue.yml. Aucune dépendance externe.
//
// Ce script ne prépare aucune candidature et n'envoie rien : il tient
// seulement le champ candidature_status de data/offres.json, pour que le site
// affiche où en est la demande. Il est déterministe (loi G-42).
//
//   demande ouverte                      -> "demandee"
//   demande fermée comme terminée        -> "envoyee"
//   demande fermée comme non planifiée   -> statut retiré (demande annulée)
//   lancement manuel (id + statut)       -> le statut choisi, "aucun" le retire
'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = process.env.OFFRES_PATH ||
  path.join(__dirname, '..', 'data', 'offres.json');
// refusee : retour négatif de l'employeur ; entretien : retour positif.
const STATUTS = ['demandee', 'preparee', 'envoyee', 'refusee', 'entretien'];

function idDepuisTitre(titre) {
  const m = String(titre || '').match(/^postuler:\s*(.+)$/i);
  return m ? m[1].trim() : null;
}

// "postuler: <id>" (bouton ➤) ou "envoyee: <id>" (bouton « C'est envoyé »).
function lireTitre(titre) {
  const m = String(titre || '').match(/^(postuler|envoyee):\s*(.+)$/i);
  return m ? { type: m[1].toLowerCase(), id: m[2].trim() } : null;
}

function refus(message) {
  return { changed: false, id: '', statut: '', message: message };
}

// Fonction pure : ne lit ni n'écrit aucun fichier, ne va pas sur le réseau.
// Elle modifie l'offre trouvée dans `data` et dit ce qu'elle a fait.
// demande = { action: 'opened' | 'closed' | 'dispatch', titre, raison, id, statut }
function appliquer(data, demande) {
  const action = demande.action;
  let id = null;
  let type = 'postuler';
  if (action === 'dispatch') {
    id = String(demande.id || '').trim();
  } else {
    const t = lireTitre(demande.titre);
    if (t) { id = t.id; type = t.type; }
  }
  if (!id) return refus('Titre ou identifiant inattendu, rien à faire.');

  const offre = (data.offres || []).find(function (o) { return o.id === id; });
  if (!offre) return refus('Offre introuvable, aucune modification.');

  const actuel = offre.candidature_status || null;
  let cible;

  if (type === 'envoyee') {
    if (action !== 'opened') return refus('Rien à faire.');
    cible = 'envoyee';
  } else if (action === 'opened') {
    if (offre.archive) return refus('Offre archivée : la demande est ignorée.');
    if (actuel) return refus('Une candidature est déjà en cours (statut : ' + actuel + ').');
    cible = 'demandee';
  } else if (action === 'closed') {
    if (demande.raison === 'completed') {
      cible = 'envoyee';
    } else if (demande.raison === 'not_planned') {
      if (actuel === 'envoyee') {
        return refus('Candidature déjà notée envoyée : le statut est conservé.');
      }
      cible = null;
    } else {
      return refus('Fermeture sans motif reconnu, aucune modification.');
    }
  } else if (action === 'dispatch') {
    if (demande.statut === 'aucun') {
      cible = null;
    } else if (STATUTS.includes(demande.statut)) {
      if (offre.archive) return refus('Offre archivée : statut non modifié.');
      cible = demande.statut;
    } else {
      return refus('Statut demandé invalide, aucune modification.');
    }
  } else {
    return refus('Action inconnue, aucune modification.');
  }

  if (cible === actuel) return refus('Statut déjà à jour, aucune modification.');

  if (cible === null) {
    delete offre.candidature_status;
  } else {
    offre.candidature_status = cible;
  }
  return {
    changed: true,
    id: offre.id,
    statut: cible || 'aucun',
    message: cible === null
      ? 'Demande annulée : le bouton Postuler réapparaît sur le site.'
      : 'Statut de candidature passé à « ' + cible + ' ».'
  };
}

function setOutput(name, value) {
  const file = process.env.GITHUB_OUTPUT;
  // Une seule ligne par sortie : on retire tout saut de ligne par sécurité.
  const propre = String(value).replace(/[\r\n]+/g, ' ');
  if (file) fs.appendFileSync(file, name + '=' + propre + '\n');
}

function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const res = appliquer(data, {
    action: process.env.DEMANDE_ACTION || '',
    titre: process.env.ISSUE_TITLE || '',
    raison: process.env.ISSUE_STATE_REASON || '',
    id: process.env.INPUT_ID || '',
    statut: process.env.INPUT_STATUT || ''
  });
  if (res.changed) {
    // Même écriture que scripts/archive-issue.js : le diff reste d'une ligne.
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  console.log(res.message + (res.id ? ' (' + res.id + ')' : ''));
  setOutput('changed', res.changed ? 'true' : 'false');
  setOutput('id', res.id);
  setOutput('statut', res.statut);
  setOutput('message', res.message);
}

if (require.main === module) {
  main();
}

module.exports = { appliquer: appliquer, idDepuisTitre: idDepuisTitre, STATUTS: STATUTS };

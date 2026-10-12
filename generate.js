// Générateur du site Radar Emploi BE.
// Aucune dépendance externe (lois SITE_WEB, étape 3). Lit data/offres.json,
// écrit _site/index.html. Le dépôt porte les sources, jamais les pages (W-19).
'use strict';
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'data', 'offres.json');
const OUT_DIR = path.join(__dirname, '_site');
const OUT_FILE = path.join(OUT_DIR, 'index.html');

function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function regionLabel(r) {
  if (r === '85') return 'Vendée';
  if (r === '44') return 'Loire-Atlantique';
  return 'Reste de la France';
}

function regionRank(r) {
  if (r === '85') return 0;
  if (r === '44') return 1;
  return 2;
}

// Une offre archivée reste affichée 30 jours dans l'onglet Archives, puis n'est
// plus affichée. Elle reste dans data/offres.json : la veille sait qu'elle a
// été écartée et ne la repropose pas.
const JOURS_ARCHIVE = 30;
function archiveVisible(o, aujourdhui) {
  if (!o.archive || !o.archive_date) return true;
  const jours = Math.floor((Date.parse(aujourdhui) - Date.parse(o.archive_date)) / 86400000);
  return jours < JOURS_ARCHIVE;
}

module.exports = { esc, regionLabel, regionRank, archiveVisible, JOURS_ARCHIVE, DATA_PATH, OUT_DIR, OUT_FILE };
const CSS = `
:root{
  --bg:#0f1720; --panel:#161f2b; --panel2:#1c2735; --border:#2a3545;
  --text:#e8edf3; --muted:#92a1b3; --accent:#3dd6a3; --accent-dark:#1f8f6c;
  --warn:#e3b341; --radius:14px;
}
*{box-sizing:border-box}
body{margin:0;background:linear-gradient(180deg,#0f1720 0%,#0c131b 100%);
  color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  line-height:1.5}
.wrap{max-width:900px;margin:0 auto;padding:0 20px 80px}
header.hero{padding:48px 20px 36px;text-align:center;
  background:radial-gradient(ellipse at top,#1a2e3f 0%,transparent 70%)}
header.hero h1{font-size:1.9rem;margin:0 0 8px;letter-spacing:-0.02em}
header.hero p{color:var(--muted);margin:0;font-size:1.02rem}
.stats{display:flex;gap:10px;justify-content:center;margin-top:22px;flex-wrap:wrap}
.stat{background:var(--panel);border:1px solid var(--border);border-radius:999px;
  padding:7px 16px;font-size:0.88rem;color:var(--muted)}
.stat b{color:var(--text)}
.region-details{margin-top:34px}
.region-details>summary{cursor:pointer;list-style:none;display:flex;align-items:center;
  gap:10px;font-size:1.05rem;text-transform:uppercase;letter-spacing:.06em;
  color:var(--accent);padding:6px 0 14px;user-select:none}
.region-details>summary::-webkit-details-marker{display:none}
.region-details>summary:before{content:"▸";transition:transform .15s;font-size:.8rem}
.region-details[open]>summary:before{transform:rotate(90deg)}
.region-details .count{color:var(--muted);font-weight:400;text-transform:none;
  letter-spacing:0;font-size:.85rem}
.card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);
  padding:16px 18px;margin-bottom:10px;transition:border-color .15s}
.card:hover{border-color:#3a4a60}
.card-top{display:flex;align-items:flex-start;gap:12px}
.card-main{flex:1;min-width:0}
.card-title{font-size:1.05rem;font-weight:600;margin:0 0 2px}
.card-sub{color:var(--muted);font-size:.9rem}
.badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
.badge{font-size:.75rem;padding:3px 9px;border-radius:999px;background:var(--panel2);
  color:var(--muted);border:1px solid var(--border)}
.badge.salaire{color:var(--accent);border-color:var(--accent-dark)}
.badge.tt{color:var(--warn)}
.card-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.chevron{display:inline-flex;align-items:center;justify-content:center;
  width:48px;height:48px;background:none;border:none;color:var(--muted);cursor:pointer;
  font-size:1.75rem;line-height:1;border-radius:10px;flex-shrink:0;transition:transform .15s,background .15s}
.chevron:hover{background:var(--panel2)}
.chevron.open{transform:rotate(180deg);color:var(--accent)}
.details{display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);
  color:var(--muted);font-size:.92rem}
.details.open{display:block}
.details a{color:var(--accent);text-decoration:none}
.details a:hover{text-decoration:underline}
.archive-btn{display:inline-flex;align-items:center;justify-content:center;
  width:48px;height:48px;background:none;border:1px solid var(--border);color:var(--muted);
  cursor:pointer;font-size:1.55rem;line-height:1;border-radius:10px;flex-shrink:0;
  text-decoration:none;transition:border-color .15s,color .15s}
.archive-btn:hover{border-color:var(--warn);color:var(--warn)}
.postuler-btn{display:inline-flex;align-items:center;justify-content:center;
  width:48px;height:48px;background:none;border:1px solid var(--accent-dark);color:var(--accent);
  cursor:pointer;font-size:1.55rem;line-height:1;border-radius:10px;flex-shrink:0;
  text-decoration:none;transition:background .15s,color .15s}
.postuler-btn:hover{background:var(--accent);color:#07211a}
.candidature-badge{font-size:.75rem;padding:6px 10px;border-radius:999px;
  background:var(--panel2);color:var(--muted);border:1px solid var(--border);
  white-space:nowrap;flex-shrink:0}
.candidature-badge.envoyee{color:var(--accent);border-color:var(--accent-dark)}
.job-descr{white-space:pre-wrap;margin:0 0 10px;padding:12px 14px;background:var(--panel2);
  border:1px solid var(--border);border-radius:10px;font-size:.88rem;max-height:340px;
  overflow-y:auto}
`;
module.exports.CSS = CSS;
const CSS2 = `
.archives{margin-top:46px}
.archives>summary{cursor:pointer;color:var(--muted);font-size:.95rem;
  list-style:none;display:flex;align-items:center;gap:8px;padding:14px 0;
  border-top:1px solid var(--border);user-select:none}
.archives>summary::-webkit-details-marker{display:none}
.archives>summary:before{content:"▸";transition:transform .15s}
.archives[open]>summary:before{transform:rotate(90deg)}
.archive-card{opacity:.65;background:var(--panel2)}
.archive-card .card-title{text-decoration:line-through;text-decoration-color:var(--border)}
.archive-motif{color:var(--warn);font-size:.85rem;margin-top:8px}
.archives .hint{font-size:.8rem;opacity:.75}
.restore-btn{display:inline-flex;align-items:center;justify-content:center;
  width:48px;height:48px;background:none;border:1px solid var(--border);color:var(--muted);
  cursor:pointer;font-size:1.55rem;line-height:1;border-radius:10px;flex-shrink:0;
  text-decoration:none;transition:border-color .15s,color .15s}
.restore-btn:hover{border-color:var(--accent);color:var(--accent)}
.bandeau{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;max-width:92%;
  background:var(--panel2);border:1px solid var(--accent-dark);color:var(--text);
  padding:10px 16px;border-radius:12px;font-size:.9rem;z-index:10;
  box-shadow:0 6px 24px rgba(0,0,0,.45)}
.bandeau.erreur{border-color:#e5534b;color:#ffb3ad}
.cle-btn{background:none;border:1px solid var(--border);color:var(--muted);border-radius:999px;
  padding:6px 14px;font-size:.82rem;cursor:pointer;margin-top:12px}
.cle-btn:hover{border-color:var(--accent);color:var(--accent)}
footer{text-align:center;color:var(--muted);font-size:.82rem;margin-top:50px}
@media(max-width:520px){
  header.hero h1{font-size:1.5rem}
  .card-top{flex-wrap:wrap}
  .card-actions{margin-left:auto;gap:4px}
  .chevron,.archive-btn,.postuler-btn,.restore-btn{width:52px;height:52px;font-size:1.75rem}
}
`;
module.exports.CSS2 = CSS2;

// Script de la page. Aucun bouton n'ouvre plus la page GitHub. Avec la clé (jeton GitHub limité aux issues de ce
// dépôt, gardé dans le navigateur, jamais dans le dépôt : W-10, W-17), un clic
// suffit : l'effet s'affiche tout de suite et la demande part en arrière-plan.
// Un échec s'affiche en rouge, jamais en silence (G-34).
const JS = `
var REPO = "Tatann85/radar-emploi";
var CLE = "radar-gh-cle";
var ATTENTE = "radar-en-attente";
var LOCALES = "radar-archives-locales";
var DELAI_ALERTE = 3600000;
var JOURS_30 = 30 * 86400000;

document.querySelectorAll(".chevron").forEach(function(btn){
  btn.addEventListener("click", function(){
    var det = document.getElementById(btn.getAttribute("data-target"));
    var open = det.classList.toggle("open");
    btn.classList.toggle("open", open);
  });
});

function lire(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
function ecrire(k, v){ try { if (v === null) { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } } catch(e){} }
function attente(){ try { return JSON.parse(lire(ATTENTE) || "{}"); } catch(e){ return {}; } }
function sauverAttente(a){ ecrire(ATTENTE, JSON.stringify(a)); }

function bandeau(msg, erreur){
  var b = document.getElementById("bandeau");
  b.textContent = msg;
  b.className = erreur ? "bandeau erreur" : "bandeau";
  b.hidden = false;
  clearTimeout(bandeau.minuteur);
  if (!erreur) { bandeau.minuteur = setTimeout(function(){ b.hidden = true; }, 4000); }
}

function compter(){
  var actives = 0;
  document.querySelectorAll(".region-details").forEach(function(d){
    var n = d.querySelectorAll(".card").length;
    actives += n;
    d.querySelector(".count").textContent = "(" + n + ")";
    d.hidden = n === 0;
  });
  var arch = document.getElementById("archives");
  var na = arch.querySelectorAll(".card").length;
  arch.querySelector(".count").textContent = "(" + na + ")";
  arch.hidden = na === 0;
  document.getElementById("nb-actives").textContent = actives;
  document.getElementById("nb-archives").textContent = na;
}

function badge(texte){
  var s = document.createElement("span");
  s.className = "candidature-badge";
  s.textContent = texte;
  return s;
}

function locales(){ try { return JSON.parse(lire(LOCALES) || "{}"); } catch(e){ return {}; } }

function montrer(card, action, bouton, texte){
  if (action === "archiver") {
    card.classList.add("archive-card");
    card.querySelectorAll("[data-action], .candidature-badge").forEach(function(x){ x.remove(); });
    card.querySelector(".card-actions").insertBefore(badge(texte || "Archivage en cours…"), card.querySelector(".chevron"));
    document.getElementById("archives").appendChild(card);
    compter();
  } else if (bouton) {
    bouton.replaceWith(badge(action === "postuler" ? "Préparation en cours…" : "Restauration en cours…"));
  }
}

(function(){
  var a = attente(), maintenant = Date.now(), change = false;
  Object.keys(a).forEach(function(id){
    var p = a[id];
    var card = document.querySelector('.card[data-id="' + id + '"]');
    var fait = !card ||
      (p.action === "archiver" && card.getAttribute("data-archive") === "1") ||
      (p.action === "restaurer" && card.getAttribute("data-archive") !== "1") ||
      (p.action === "postuler" && !card.querySelector('[data-action="postuler"]'));
    if (fait) { delete a[id]; change = true; return; }
    if (maintenant - p.t > DELAI_ALERTE) {
      delete a[id]; change = true;
      bandeau("La demande " + p.action + " pour " + id + " n'apparaît toujours pas sur le site après une heure. Vérifie sur GitHub.", true);
      return;
    }
    montrer(card, p.action, card.querySelector('[data-action="' + p.action + '"]'));
  });
  if (change) { sauverAttente(a); }
})();

(function(){
  var l = locales(), maintenant = Date.now(), change = false;
  Object.keys(l).forEach(function(id){
    var card = document.querySelector('.card[data-id="' + id + '"]');
    if (!card || card.getAttribute("data-archive") === "1") { delete l[id]; change = true; return; }
    if (maintenant - l[id] >= JOURS_30) { card.remove(); compter(); return; }
    montrer(card, "archiver", null, "Archivée sur cet appareil");
  });
  if (change) { ecrire(LOCALES, JSON.stringify(l)); }
})();

function archiverIci(id, el){
  var l = locales();
  l[id] = Date.now();
  ecrire(LOCALES, JSON.stringify(l));
  montrer(el.closest(".card"), "archiver", el, "Archivée sur cet appareil");
  bandeau("Archivée sur cet appareil seulement. Active le clic direct (🔑 en bas de page) pour l'enregistrer partout.");
}

function validerCle(v){
  return fetch("https://api.github.com/repos/" + REPO, { headers: { "Authorization": "Bearer " + v, "Accept": "application/vnd.github+json" } })
    .then(function(r){
      if (!r.ok) { throw new Error("GitHub a répondu " + r.status); }
      ecrire(CLE, v);
      etiquetteCle();
    });
}

// Plus aucune page GitHub ne s'ouvre : sans clé, le site la demande une fois ;
// si on refuse, la poubelle archive sur cet appareil seulement.
document.addEventListener("click", function(ev){
  var el = ev.target.closest("[data-action]");
  if (!el) { return; }
  ev.preventDefault();
  var action = el.getAttribute("data-action");
  var id = el.getAttribute("data-id");
  var cle = lire(CLE);
  if (cle) { envoyer(cle, action, id, el); return; }
  var v = window.prompt("Pour agir en un clic, colle ta clé GitHub (une seule fois sur cet appareil)." +
    (action === "archiver" ? " Annuler : archiver seulement sur cet appareil." : ""), "");
  v = v === null ? "" : v.trim();
  if (!v) {
    if (action === "archiver") { archiverIci(id, el); }
    else { bandeau("Sans clé, la demande ne peut pas être enregistrée. Active le clic direct avec le bouton 🔑 en bas de page.", true); }
    return;
  }
  validerCle(v).then(function(){ envoyer(v, action, id, el); })
    .catch(function(e){ bandeau("Clé refusée, rien n'a été fait : " + e.message, true); });
});

function envoyer(cle, action, id, el){
  var card = el.closest(".card");
  var a = attente();
  a[id] = { action: action, t: Date.now() };
  sauverAttente(a);
  montrer(card, action, el);
  fetch("https://api.github.com/repos/" + REPO + "/issues", {
    method: "POST",
    headers: { "Authorization": "Bearer " + cle, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ title: action + ": " + id, body: "Demande envoyée depuis le site en un clic." })
  }).then(function(r){
    if (!r.ok) { throw new Error("GitHub a répondu " + r.status + (r.status === 401 ? ", clé refusée ou expirée" : "")); }
    bandeau(action === "archiver" ? "Archivée. Le site se met à jour dans quelques minutes."
      : action === "postuler" ? "Demande de candidature enregistrée."
      : "Restauration demandée.");
  }).catch(function(e){
    var b = attente(); delete b[id]; sauverAttente(b);
    bandeau("Échec, rien n'a été enregistré : " + e.message + ". Recharge la page avant de réessayer.", true);
  });
}

function etiquetteCle(){
  document.getElementById("cle-btn").textContent = lire(CLE)
    ? "🔑 Clic direct actif sur cet appareil (changer ou effacer la clé)"
    : "🔑 Activer le clic direct sur cet appareil";
}
document.getElementById("cle-btn").addEventListener("click", function(){
  var v = window.prompt("Colle ta clé GitHub (jeton limité aux issues de radar-emploi). Laisse vide puis OK pour l'effacer de cet appareil.", "");
  if (v === null) { return; }
  v = v.trim();
  if (!v) { ecrire(CLE, null); etiquetteCle(); bandeau("Clé effacée de cet appareil."); return; }
  validerCle(v)
    .then(function(){ bandeau("Clé valide, enregistrée sur cet appareil."); })
    .catch(function(e){ bandeau("Clé refusée, rien n'a été enregistré : " + e.message, true); });
});
etiquetteCle();
`;
module.exports.JS = JS;
function renderCard(o, archived) {
  var badges = '';
  if (o.salaire) badges += '<span class="badge salaire">' + esc(o.salaire) + '</span>';
  if (o.teletravail) badges += '<span class="badge tt">Télétravail : ' + esc(o.teletravail) + '</span>';
  badges += '<span class="badge">' + esc(o.source) + '</span>';
  var detId = 'det-' + o.id;
  var motif = archived && o.archive_motif
    ? '<p class="archive-motif">Archivée' + (o.archive_date ? ' le ' + esc(o.archive_date) : '') +
      ' : ' + esc(o.archive_motif) + '</p>' : '';
  var notes = o.notes ? '<p>' + esc(o.notes) + '</p>' : '';
  var descr = o.description ? '<div class="job-descr">' + esc(o.description) + '</div>' : '';
  var archiveUrl = 'https://github.com/Tatann85/radar-emploi/issues/new?' +
    'title=' + encodeURIComponent('archiver: ' + o.id) +
    '&labels=' + encodeURIComponent('archive') +
    '&body=' + encodeURIComponent('Motif (optionnel), à remplacer avant de valider :\n\n');
  var archiveBtn = archived ? '' :
    '<a class="archive-btn" data-action="archiver" data-id="' + esc(o.id) + '" href="' + archiveUrl +
    '" target="_blank" rel="noopener" aria-label="Archiver cette offre" title="Archiver">🗑</a>';
  var restaurerUrl = 'https://github.com/Tatann85/radar-emploi/issues/new?' +
    'title=' + encodeURIComponent('restaurer: ' + o.id);
  var restoreBtn = !archived ? '' :
    '<a class="restore-btn" data-action="restaurer" data-id="' + esc(o.id) + '" href="' + restaurerUrl +
    '" target="_blank" rel="noopener" aria-label="Restaurer cette offre" title="Restaurer">↩</a>';

  var postulerUrl = 'https://github.com/Tatann85/radar-emploi/issues/new?' +
    'title=' + encodeURIComponent('postuler: ' + o.id) +
    '&labels=' + encodeURIComponent('postuler') +
    '&body=' + encodeURIComponent('Candidature demandee depuis le site. Ne rien modifier ci-dessous.\n\n');
  var candStatus = o.candidature_status || null;
  var candAction = '';
  if (archived) {
    candAction = '';
  } else if (candStatus === 'envoyee') {
    candAction = '<span class="candidature-badge envoyee">✓ Candidature envoyée</span>';
  } else if (candStatus === 'preparee') {
    candAction = '<span class="candidature-badge">En attente de ta validation</span>';
  } else if (candStatus === 'demandee') {
    candAction = '<span class="candidature-badge">Préparation en cours…</span>';
  } else {
    candAction = '<a class="postuler-btn" data-action="postuler" data-id="' + esc(o.id) + '" href="' +
      postulerUrl + '" target="_blank" rel="noopener" ' +
      'aria-label="Postuler à cette offre" title="Postuler">➤</a>';
  }

  return '' +
    '<div class="card' + (archived ? ' archive-card' : '') + '" data-id="' + esc(o.id) + '"' +
      (archived ? ' data-archive="1"' : '') + '>' +
      '<div class="card-top">' +
        '<div class="card-main">' +
          '<p class="card-title">' + esc(o.titre) + '</p>' +
          '<p class="card-sub">' + esc(o.entreprise) + ' — ' + esc(o.lieu) + '</p>' +
          '<div class="badges">' + badges + '</div>' +
        '</div>' +
        '<div class="card-actions">' +
          candAction +
          archiveBtn +
          restoreBtn +
          '<button class="chevron" data-target="' + detId + '" aria-label="Détail">▾</button>' +
        '</div>' +
      '</div>' +
      '<div class="details" id="' + detId + '">' +
        notes + descr + motif +
        '<p><a href="' + esc(o.url) + '" target="_blank" rel="noopener">Voir l\'offre originale →</a></p>' +
      '</div>' +
    '</div>';
}
module.exports.renderCard = renderCard;
function build(data, aujourdhui) {
  aujourdhui = aujourdhui || new Date().toISOString().slice(0, 10);
  var actives = data.offres.filter(function (o) { return !o.archive; });
  var archived = data.offres.filter(function (o) { return o.archive && archiveVisible(o, aujourdhui); });
  var masquees = data.offres.filter(function (o) { return o.archive && !archiveVisible(o, aujourdhui); });
  archived.sort(function (a, b) { return String(b.archive_date || '').localeCompare(String(a.archive_date || '')); });
  actives.sort(function (a, b) { return regionRank(a.region) - regionRank(b.region); });

  var byRegion = {};
  actives.forEach(function (o) {
    (byRegion[o.region] = byRegion[o.region] || []).push(o);
  });
  var regionOrder = Object.keys(byRegion).sort(function (a, b) {
    return regionRank(a) - regionRank(b);
  });

  var sections = regionOrder.map(function (r) {
    var list = byRegion[r];
    return '<details class="region-details" open><summary>' + esc(regionLabel(r)) +
      ' <span class="count">(' + list.length + ')</span></summary>' +
      list.map(function (o) { return renderCard(o, false); }).join('') +
      '</details>';
  }).join('');

  // Toujours présente (masquée si vide) : le script y range une offre archivée
  // d'un clic, sans attendre la republication.
  var archiveSection =
    '<details class="archives" id="archives"' + (archived.length ? '' : ' hidden') + '>' +
    '<summary>Archives <span class="count">(' + archived.length + ')</span>' +
    ' <span class="hint">· retirées du site au bout de ' + JOURS_ARCHIVE + ' jours</span></summary>' +
    archived.map(function (o) { return renderCard(o, true); }).join('') +
    '</details>';

  return { sections: sections, archiveSection: archiveSection, activeCount: actives.length,
    archiveCount: archived.length, masqueeCount: masquees.length };
}
module.exports.build = build;
function page(data) {
  var b = build(data);
  return '<!doctype html>\n<html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="robots" content="noindex,nofollow">' +
    '<title>Radar Emploi — Bureau d\'Études Mécanique</title>' +
    '<style>' + CSS + CSS2 + '</style></head><body>' +
    '<div class="wrap">' +
    '<header class="hero"><h1>Radar Emploi — Responsable Bureau d\'Études</h1>' +
    '<p>Ingénieur mécanique, 16 ans d\'expérience (conception, calcul EF, management de BE). ' +
    'Vendée en priorité, Nantes en télétravail partiel, France entière en télétravail total.</p>' +
    '<div class="stats">' +
    '<span class="stat"><b id="nb-actives">' + b.activeCount + '</b> offres actives</span>' +
    '<span class="stat"><b id="nb-archives">' + b.archiveCount + '</b> en archive</span>' +
    '<span class="stat">Mis à jour le ' + esc(data.generated_at) + '</span>' +
    '</div></header>' +
    b.sections + b.archiveSection +
    '<footer>Radar Emploi BE — usage personnel d\'Antoine Baud, page privée.' +
    '<br><button id="cle-btn" class="cle-btn" type="button">🔑 Activer le clic direct sur cet appareil</button>' +
    '</footer>' +
    '<div id="bandeau" class="bandeau" role="status" hidden></div>' +
    '</div><script>' + JS + '</script></body></html>';
}
module.exports.page = page;

function main() {
  var raw = fs.readFileSync(DATA_PATH, 'utf8');
  var data = JSON.parse(raw);
  if (!Array.isArray(data.offres) || data.offres.length === 0) {
    throw new Error('offres.json ne contient aucune offre');
  }
  data.offres.forEach(function (o) {
    if (!o.id || !o.titre || !o.entreprise || !o.region) {
      throw new Error('offre incomplète : ' + JSON.stringify(o));
    }
  });
  var html = page(data);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, html, 'utf8');
  console.log('OK : ' + OUT_FILE + ' (' + data.offres.length + ' offres)');
}

if (require.main === module) {
  main();
}
module.exports.main = main;

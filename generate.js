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

module.exports = { esc, regionLabel, regionRank, DATA_PATH, OUT_DIR, OUT_FILE };
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
section.region{margin-top:34px}
section.region h2{font-size:1.05rem;text-transform:uppercase;letter-spacing:.06em;
  color:var(--accent);margin:0 0 14px;display:flex;align-items:center;gap:10px}
section.region h2 .count{color:var(--muted);font-weight:400;text-transform:none;
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
.card-actions{display:flex;align-items:center;gap:10px;flex-shrink:0}
.chk{width:20px;height:20px;accent-color:var(--accent);cursor:pointer}
.chevron{background:none;border:none;color:var(--muted);cursor:pointer;font-size:1.1rem;
  padding:4px;line-height:1;transition:transform .15s}
.chevron.open{transform:rotate(180deg);color:var(--accent)}
.details{display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);
  color:var(--muted);font-size:.92rem}
.details.open{display:block}
.details a{color:var(--accent);text-decoration:none}
.details a:hover{text-decoration:underline}
`;
module.exports.CSS = CSS;
const CSS2 = `
.archives{margin-top:46px}
.archives>summary{cursor:pointer;color:var(--muted);font-size:.95rem;
  list-style:none;display:flex;align-items:center;gap:8px;padding:10px 0;
  border-top:1px solid var(--border)}
.archives>summary::-webkit-details-marker{display:none}
.archives>summary:before{content:"▸";transition:transform .15s}
.archives[open]>summary:before{transform:rotate(90deg)}
.archive-card{opacity:.65;background:var(--panel2)}
.archive-card .card-title{text-decoration:line-through;text-decoration-color:var(--border)}
.archive-motif{color:var(--warn);font-size:.85rem;margin-top:8px}
footer{text-align:center;color:var(--muted);font-size:.82rem;margin-top:50px}
@media(max-width:520px){
  header.hero h1{font-size:1.5rem}
  .card-top{flex-wrap:wrap}
  .card-actions{margin-left:auto}
}
`;
module.exports.CSS2 = CSS2;

const JS = `
document.querySelectorAll('.chevron').forEach(function(btn){
  btn.addEventListener('click', function(){
    var det = document.getElementById(btn.getAttribute('data-target'));
    var open = det.classList.toggle('open');
    btn.classList.toggle('open', open);
  });
});
try{
  var saved = JSON.parse(localStorage.getItem('radar_interet') || '{}');
  document.querySelectorAll('.chk').forEach(function(cb){
    var id = cb.getAttribute('data-id');
    if(saved[id]) cb.checked = true;
    cb.addEventListener('change', function(){
      saved[id] = cb.checked;
      localStorage.setItem('radar_interet', JSON.stringify(saved));
    });
  });
}catch(e){}
`;
module.exports.JS = JS;
function renderCard(o, archived) {
  var badges = '';
  if (o.salaire) badges += '<span class="badge salaire">' + esc(o.salaire) + '</span>';
  if (o.teletravail) badges += '<span class="badge tt">Télétravail : ' + esc(o.teletravail) + '</span>';
  badges += '<span class="badge">' + esc(o.source) + '</span>';
  var detId = 'det-' + o.id;
  var motif = archived && o.archive_motif
    ? '<p class="archive-motif">Archivée : ' + esc(o.archive_motif) + '</p>' : '';
  var notes = o.notes ? '<p>' + esc(o.notes) + '</p>' : '';
  return '' +
    '<div class="card' + (archived ? ' archive-card' : '') + '">' +
      '<div class="card-top">' +
        (archived ? '' : '<input type="checkbox" class="chk" data-id="' + esc(o.id) + '" aria-label="Marquer un intérêt">') +
        '<div class="card-main">' +
          '<p class="card-title">' + esc(o.titre) + '</p>' +
          '<p class="card-sub">' + esc(o.entreprise) + ' — ' + esc(o.lieu) + '</p>' +
          '<div class="badges">' + badges + '</div>' +
        '</div>' +
        '<div class="card-actions">' +
          '<button class="chevron" data-target="' + detId + '" aria-label="Détail">▾</button>' +
        '</div>' +
      '</div>' +
      '<div class="details" id="' + detId + '">' +
        notes + motif +
        '<p><a href="' + esc(o.url) + '" target="_blank" rel="noopener">Voir l\'offre originale →</a></p>' +
      '</div>' +
    '</div>';
}
module.exports.renderCard = renderCard;
function build(data) {
  var actives = data.offres.filter(function (o) { return !o.archive; });
  var archived = data.offres.filter(function (o) { return o.archive; });
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
    return '<section class="region"><h2>' + esc(regionLabel(r)) +
      ' <span class="count">(' + list.length + ')</span></h2>' +
      list.map(function (o) { return renderCard(o, false); }).join('') +
      '</section>';
  }).join('');

  var archiveSection = archived.length ? (
    '<details class="archives"><summary>Archives (' + archived.length + ')</summary>' +
    archived.map(function (o) { return renderCard(o, true); }).join('') +
    '</details>'
  ) : '';

  return { sections: sections, archiveSection: archiveSection, activeCount: actives.length, archiveCount: archived.length };
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
    '<span class="stat"><b>' + b.activeCount + '</b> offres actives</span>' +
    '<span class="stat"><b>' + b.archiveCount + '</b> en archive</span>' +
    '<span class="stat">Mis à jour le ' + esc(data.generated_at) + '</span>' +
    '</div></header>' +
    b.sections + b.archiveSection +
    '<footer>Radar Emploi BE — usage personnel d\'Antoine Baud, page privée.</footer>' +
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

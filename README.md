# Radar Emploi BE

Site de veille emploi personnel d'Antoine Baud (Responsable Bureau d'Études
Mécanique). Usage privé.

## Structure
- `data/offres.json` — source de vérité des offres (W-01).
- `generate.js` — générateur sans dépendance, écrit `_site/index.html`.
- `test.js` — batterie de tests (W-13), lancée avant génération.
- `.github/workflows/deploy.yml` — publication automatique (push, horaire, manuel).

Le dossier `_site/` est généré, jamais commité (W-19). Pour prévisualiser en
local : `node generate.js` puis ouvrir `_site/index.html`.

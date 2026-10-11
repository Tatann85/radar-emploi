Set-Location 'C:\Users\antoi\Documents\radar-emploi'
git rm -r --cached _site | Out-Null
git rm --cached _preview_server.js | Out-Null
git add -A
git commit -m "chore: gitignore du dossier genere, tests W-13, workflow Pages, README"
git push origin main 2>&1 | Out-String

Set-Location 'C:\Users\antoi\Documents\radar-emploi'
$line = "Configure le " + (Get-Date -Format 'yyyy-MM-dd') + " par l'agent Claude (clonage + config git, cf. lois SITE_WEB)."
Add-Content -Path README.md -Value "`n$line" -Encoding utf8
git add -A
git commit -m "chore: initialisation du depot (clonage et config git)"
git push origin main 2>&1 | Out-String

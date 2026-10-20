# Deploy this folder to GitHub Pages (public).
# Usage (PowerShell, from the site folder):
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1 -Repo "portfolio" -Message "Update projects"
# Default repo "Yooniversity.github.io" publishes at https://yooniversity.github.io/
# Any other name publishes at https://yooniversity.github.io/<repo>/

param(
  [string]$Owner   = "Yooniversity",
  [string]$Repo    = "Yooniversity.github.io",
  [string]$Message = ("Update site " + (Get-Date -Format "yyyy-MM-dd HH:mm"))
)
# "Continue": native commands report via $LASTEXITCODE; "Stop" makes PS 5.1 throw on redirected stderr.
$ErrorActionPreference = "Continue"
Set-Location (Split-Path -Parent $PSScriptRoot)

function Need($cmd, $hint) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { Write-Host "Missing: $cmd. $hint" -ForegroundColor Red; exit 1 }
}
Need git "Install: winget install Git.Git"
Need gh  "Install: winget install GitHub.cli"

gh auth status 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Host "Signing in to GitHub..."; gh auth login --web --git-protocol https }

$full = "$Owner/$Repo"

if (-not (Test-Path ".git")) {
  git init -b main | Out-Null
}
# Commit identity (local to this repo) if none is configured
if (-not (git config user.name))  { git config user.name  (gh api user --jq ".login") }
if (-not (git config user.email)) { git config user.email ((gh api user --jq ".id") + "+" + (gh api user --jq ".login") + "@users.noreply.github.com") }
git add -A
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m $Message | Out-Null } else { Write-Host "No changes to commit." }

gh repo view $full 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Creating public repo $full ..."
  gh repo create $full --public --source . --remote origin --push --description "Hayoon Park - architecture & research"
} else {
  if (-not (git remote 2>$null | Select-String -SimpleMatch "origin")) { git remote add origin "https://github.com/$full.git" }
  git push -u origin main
}

# Enable Pages (main branch, root). Already-enabled returns an error we can ignore.
gh api -X POST "repos/$full/pages" -f "source[branch]=main" -f "source[path]=/" 2>$null | Out-Null

if ($Repo -ieq "$Owner.github.io") { $url = "https://$($Owner.ToLower()).github.io/" }
else { $url = "https://$($Owner.ToLower()).github.io/$Repo/" }
Write-Host "Deployed. Live in 1-2 minutes at: $url" -ForegroundColor Green

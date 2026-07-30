# Quick-start script for the varsha website starter (Windows).
# Usage: irm https://myndlabs.tech/install.ps1 | iex

[CmdletBinding()]
param(
  [string]$Dir = "my-varsha-site"
)

$ErrorActionPreference = "Stop"
$TemplateRepo = "yethikrishna/web-ui-template"

Write-Host ""
Write-Host "⚡ varsha — premium website starter by myndlabs.tech" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating your site in .\$Dir ..."

if (Get-Command npx -ErrorAction SilentlyContinue) {
  try {
    npx degit $TemplateRepo $Dir 2>$null
    if (-not (Test-Path $Dir)) { throw "degit failed" }
  } catch {
    Write-Host "npx degit not available, falling back to git clone..."
    git clone --depth=1 "https://github.com/$TemplateRepo.git" $Dir
    if (Test-Path "$Dir\.git") { Remove-Item -Recurse -Force "$Dir\.git" }
  }
} else {
  git clone --depth=1 "https://github.com/$TemplateRepo.git" $Dir
  if (Test-Path "$Dir\.git") { Remove-Item -Recurse -Force "$Dir\.git" }
}

Write-Host ""
Write-Host "✓ Site created in .\$Dir" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  cd $Dir"
Write-Host "  npm install"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Docs: https://myndlabs.tech/docs/"
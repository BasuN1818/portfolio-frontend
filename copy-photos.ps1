# NB Studio — Copy Your Photos Into the Project
# Run this script to automatically copy your portrait photos into the website folder.
# 
# HOW TO USE:
#   1. Right-click this file → "Run with PowerShell"
#   2. Or open PowerShell and run: .\copy-photos.ps1

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   NB Studio — Photo Setup                     " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# ── Option A: Auto-detect if photos already exist ──────────────────
$img1 = Join-Path $projectDir "image1.png"
$img2 = Join-Path $projectDir "image2.png"

if ((Test-Path $img1) -and (Test-Path $img2)) {
    Write-Host "✅ Both image1.png and image2.png already exist!" -ForegroundColor Green
    Write-Host "   Open index.html in your browser to view the site." -ForegroundColor Gray
    Write-Host ""
    # Open the site
    Start-Process (Join-Path $projectDir "index.html")
    Read-Host "Press ENTER to close"
    exit
}

Write-Host "📸 Please provide paths to your two portrait photos." -ForegroundColor Yellow
Write-Host ""

# ── Photo 1 (eyes closed - white shirt) ────────────────────────────
Write-Host "PHOTO 1 — Eyes-closed / White-shirt portrait" -ForegroundColor Cyan
Write-Host "  (This becomes image1.png — the grayscale top layer)" -ForegroundColor Gray
$p1 = Read-Host "  Enter full path to photo 1 (or drag & drop the file)"
$p1 = $p1.Trim('"').Trim("'").Trim()

if (Test-Path $p1) {
    Copy-Item $p1 -Destination $img1 -Force
    Write-Host "  ✅ Copied as image1.png" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  File not found. Skipping image1." -ForegroundColor Red
}

Write-Host ""

# ── Photo 2 (smiling - black blazer) ───────────────────────────────
Write-Host "PHOTO 2 — Smiling / Black-blazer portrait" -ForegroundColor Cyan
Write-Host "  (This becomes image2.png — the color bottom layer)" -ForegroundColor Gray
$p2 = Read-Host "  Enter full path to photo 2 (or drag & drop the file)"
$p2 = $p2.Trim('"').Trim("'").Trim()

if (Test-Path $p2) {
    Copy-Item $p2 -Destination $img2 -Force
    Write-Host "  ✅ Copied as image2.png" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  File not found. Skipping image2." -ForegroundColor Red
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   Opening your website now...                 " -ForegroundColor White
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Start-Process (Join-Path $projectDir "index.html")
Read-Host "Press ENTER to close"

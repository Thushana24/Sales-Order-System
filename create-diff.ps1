# =============================
# Create Diff File for Entire Project
# =============================

# Output file on Desktop
$diffFile = "$env:USERPROFILE\Desktop\SalesOrderSystem-diff.txt"

# Folders to exclude
$frontendExcludes = @("node_modules", "package-lock.json", "src/app/fonts", "public")
$backendExcludes = @("bin", "obj", ".vs")

# Remove old diff file if exists
if (Test-Path $diffFile) { Remove-Item $diffFile }

Write-Host "Generating diff file at $diffFile`n"

# -----------------------------
# 1️⃣ Frontend Diff (Next.js)
# -----------------------------
$frontendPath = Join-Path $PWD "frontend"
if (Test-Path $frontendPath) {
    Set-Location $frontendPath
    Write-Host "Processing frontend..."
    $excludeParams = $frontendExcludes | ForEach-Object { ":^$_" }

    # Staged changes
    git diff --cached -- . $excludeParams | Out-File -FilePath $diffFile

    # Unstaged/untracked files
    git ls-files --others --exclude-standard $(foreach ($f in $frontendExcludes) { ":!$f/*" }) |
    ForEach-Object {
        Write-Output ("+++ $_")
        Get-Content $_
    } | Out-File -FilePath $diffFile -Append
}

# -----------------------------
# 2️⃣ Backend Diff (.NET)
# -----------------------------
$backendPath = Join-Path $PWD "SalesOrderAPI"
if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "Processing backend..."
    $excludeParams = $backendExcludes | ForEach-Object { ":^$_" }

    # Staged changes
    git diff --cached -- . $excludeParams | Out-File -FilePath $diffFile -Append

    # Unstaged/untracked files
    git ls-files --others --exclude-standard $(foreach ($f in $backendExcludes) { ":!$f/*" }) |
    ForEach-Object {
        Write-Output ("+++ $_")
        Get-Content $_
    } | Out-File -FilePath $diffFile -Append
}

Write-Host "`nDiff file created successfully at $diffFile"

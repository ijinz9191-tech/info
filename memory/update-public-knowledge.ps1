param([switch]$Resume, [ValidateRange(1,8)][int]$Workers = 4)
$ErrorActionPreference = 'Stop'
$taskRoot = $PSScriptRoot
function Invoke-Checked {
    param([string]$Executable, [string[]]$Arguments)
    & $Executable @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Failed: $Executable (exit $LASTEXITCODE)" }
}
Invoke-Checked 'node' @((Join-Path $taskRoot 'sync-cncf.mjs'), '--refresh')
Invoke-Checked 'python' @((Join-Path $taskRoot 'refresh-snapshot-notes.py'))
$mode = if ($Resume) { '--resume' } else { '--refresh' }
Invoke-Checked 'python' @((Join-Path $taskRoot 'sync-public-corpus.py'), $mode, '--workers', "$Workers")
Invoke-Checked 'python' @((Join-Path $taskRoot 'sync-public-corpus.py'), '--audit')
Invoke-Checked 'python' @((Join-Path $taskRoot 'build-training-corpus.py'), '--build')
Invoke-Checked 'python' @((Join-Path $taskRoot 'build-training-corpus.py'), '--check')
Invoke-Checked 'node' @((Join-Path $taskRoot 'build-openviking-resources.mjs'), '--build')
Invoke-Checked 'node' @((Join-Path $taskRoot 'build-openviking-resources.mjs'), '--check')
$report = Get-Content -LiteralPath (Join-Path $taskRoot 'corpus/acquisition-report.json') -Raw | ConvertFrom-Json
$failures = @($report.attempts | Where-Object { $_.status -in @('FAILED','NOT_ATTEMPTED_RATE_LIMIT') })
if ($failures.Count -gt 0 -or $report.unresolvedCncfEntries.Count -gt 0) {
    Write-Warning "Corpus prepared with source gaps. Read corpus/acquisition-report.json ($($failures.Count) failed/unattempted repositories)."
}
Write-Output 'Manual update finished. No model training, native server import, schedule, or Git push was performed by this script.'

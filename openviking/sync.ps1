$ErrorActionPreference = 'Stop'
$ovRuntimeRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\.ov-runtime')).Path
$ovMemoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\memory')).Path
$env:OPENVIKING_CONFIG_FILE = Join-Path $ovRuntimeRoot 'ov.conf'
$env:OPENVIKING_URL = 'http://127.0.0.1:1933'
& node (Join-Path $ovMemoryRoot 'maintenance.mjs') --audit
if ($LASTEXITCODE -ne 0) { throw 'Wiki audit failed' }
& node (Join-Path $ovMemoryRoot 'check-voc-coverage.mjs')
if ($LASTEXITCODE -ne 0) { throw 'VOC coverage failed' }
& node (Join-Path $ovMemoryRoot 'build-openviking-resources.mjs') --check
if ($LASTEXITCODE -ne 0) { throw 'OpenViking resource manifest failed' }
$manifestPath = Join-Path $ovMemoryRoot 'openviking\manifest.json'
$reportPath = Join-Path $ovMemoryRoot 'openviking\native-import-report.json'
$manifestHash = (Get-FileHash -LiteralPath $manifestPath -Algorithm SHA256).Hash.ToLowerInvariant()
$report = if (Test-Path -LiteralPath $reportPath) { Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json } else { $null }
if ($report -and $report.manifestSha256 -eq $manifestHash -and $report.state -eq 'IMPORT_QUEUED') {
  & node (Join-Path $PSScriptRoot 'monitor.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Native import task failed' }
  $report = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json
  if ($report.state -eq 'IMPORT_QUEUED') { Write-Output 'Native import is still processing.'; return }
}
if (-not $report -or $report.manifestSha256 -ne $manifestHash -or $report.state -eq 'IMPORT_FAILED') {
  $env:OPENVIKING_WAIT = '0'
  $env:OPENVIKING_PROCESSING_MODE = 'vectors_only'
  & (Join-Path $ovRuntimeRoot 'venv\Scripts\python.exe') (Join-Path $ovMemoryRoot 'import-openviking-native.py')
  if ($LASTEXITCODE -ne 0) { throw 'Native OpenViking import submission failed' }
  & node (Join-Path $PSScriptRoot 'monitor.mjs')
  if ($LASTEXITCODE -ne 0) { throw 'Native import task failed' }
  $report = Get-Content -LiteralPath $reportPath -Raw | ConvertFrom-Json
  if ($report.state -eq 'IMPORT_QUEUED') { Write-Output 'Native import was queued; run sync.ps1 again to check completion.'; return }
}
if ($report.state -ne 'IMPORT_COMPLETED_AWAITING_READBACK') { throw "Unexpected native import state: $($report.state)" }
& node (Join-Path $ovMemoryRoot 'verify-openviking-native.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Native readback or search failed' }
Write-Output 'Native import and sample read/search verification completed.'

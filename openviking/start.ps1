$ErrorActionPreference = 'Stop'
$ovRuntimeRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\.ov-runtime')).Path
$ovServer = Join-Path $ovRuntimeRoot 'venv\Scripts\openviking-server.exe'
$ovOllama = Join-Path $ovRuntimeRoot 'ollama\ollama.exe'
$ovConfig = Join-Path $ovRuntimeRoot 'ov.conf'
foreach ($item in @($ovServer, $ovOllama, $ovConfig)) {
  if (-not (Test-Path -LiteralPath $item)) { throw "Missing runtime file: $item" }
}
$env:OPENVIKING_CONFIG_FILE = $ovConfig
$env:OLLAMA_MODELS = Join-Path $ovRuntimeRoot 'models'
$env:OLLAMA_HOST = '127.0.0.1:11434'
$env:OLLAMA_NO_CLOUD = '1'
$env:OLLAMA_NUM_PARALLEL = '1'
function Test-LocalService([string] $ovUrl) {
  try { $null = Invoke-RestMethod -Uri $ovUrl -TimeoutSec 3; return $true }
  catch { return $false }
}
if (-not (Test-LocalService 'http://127.0.0.1:11434/api/version')) {
  Start-Process -FilePath $ovOllama -ArgumentList 'serve' -WindowStyle Hidden -RedirectStandardOutput (Join-Path $ovRuntimeRoot 'ollama-stdout.log') -RedirectStandardError (Join-Path $ovRuntimeRoot 'ollama-stderr.log') | Out-Null
  for ($i = 0; $i -lt 30 -and -not (Test-LocalService 'http://127.0.0.1:11434/api/version'); $i++) { Start-Sleep -Seconds 1 }
}
if (-not (Test-LocalService 'http://127.0.0.1:11434/api/version')) { throw 'Ollama failed to start; inspect ollama-stderr.log' }
if (-not (Test-LocalService 'http://127.0.0.1:1933/health')) {
  Start-Process -FilePath $ovServer -WindowStyle Hidden -RedirectStandardOutput (Join-Path $ovRuntimeRoot 'openviking-stdout.log') -RedirectStandardError (Join-Path $ovRuntimeRoot 'openviking-stderr.log') | Out-Null
  for ($i = 0; $i -lt 90 -and -not (Test-LocalService 'http://127.0.0.1:1933/health'); $i++) { Start-Sleep -Seconds 1 }
}
if (-not (Test-LocalService 'http://127.0.0.1:1933/health')) { throw 'OpenViking failed to start; inspect openviking-stderr.log' }
Write-Output 'OpenViking and Ollama are responding on loopback.'

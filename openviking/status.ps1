$ErrorActionPreference = 'Stop'
$ovRuntimeRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\.ov-runtime')).Path
$env:OPENVIKING_CONFIG_FILE = Join-Path $ovRuntimeRoot 'ov.conf'
$ovOllama = Join-Path $ovRuntimeRoot 'ollama\ollama.exe'
$ovServer = Join-Path $ovRuntimeRoot 'venv\Scripts\openviking-server.exe'
try { Write-Output ('Ollama: ' + (Invoke-RestMethod 'http://127.0.0.1:11434/api/version' -TimeoutSec 5 | ConvertTo-Json -Compress)) }
catch { Write-Output 'Ollama: UNAVAILABLE' }
try { Write-Output ('OpenViking: ' + (Invoke-RestMethod 'http://127.0.0.1:1933/health' -TimeoutSec 5 | ConvertTo-Json -Compress)) }
catch { Write-Output 'OpenViking: UNAVAILABLE' }
if (Test-Path -LiteralPath $ovOllama) { & $ovOllama list }
if (Test-Path -LiteralPath $ovServer) { & $ovServer doctor }

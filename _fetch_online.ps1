[System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
function G($u) {
  try {
    $r = Invoke-WebRequest -Uri $u -TimeoutSec 20 -ErrorAction Stop
    return $r.Content
  } catch {
    return "ERR: " + $_.Exception.Message
  }
}
$h = G('https://appclean.ewuse.com/')
[System.IO.File]::WriteAllText('_online_index.html', $h)
[System.IO.File]::WriteAllText('_online_app.state.js', (G('https://appclean.ewuse.com/prototype/app/app.state.js')))
[System.IO.File]::WriteAllText('_online_render.js', (G('https://appclean.ewuse.com/prototype/app/render.js')))
[System.IO.File]::WriteAllText('_online_generate.js', (G('https://appclean.ewuse.com/prototype/app/generate.js')))
[System.IO.File]::WriteAllText('_online_settings.js', (G('https://appclean.ewuse.com/prototype/app/settings.js')))
[System.IO.File]::WriteAllText('_online_app.ui.handlers.js', (G('https://appclean.ewuse.com/prototype/app/app.ui.handlers.js')))
Write-Host ("index bytes: " + $h.Length)

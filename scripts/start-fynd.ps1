$ErrorActionPreference = "Stop"

if (Test-Path ".env.local") {
  Get-Content ".env.local" | ForEach-Object {
    if ($_ -match "^\s*#" -or $_ -notmatch "=") {
      return
    }

    $name, $value = $_ -split "=", 2
    [Environment]::SetEnvironmentVariable($name.Trim(), $value.Trim(), "Process")
  }
}

if (-not $env:TYCHO_API_KEY) {
  throw "TYCHO_API_KEY is required. Put it in .env.local or set it in this shell."
}

if (-not $env:RPC_URL) {
  Write-Warning "RPC_URL is not set. Fynd will use its documented default, but production should use a dedicated RPC endpoint."
}

$fyndDir = Join-Path (Get-Location) "vendor\fynd"
if (-not (Test-Path $fyndDir)) {
  throw "Fynd source is missing at vendor\fynd. Run: git clone https://github.com/propeller-heads/fynd.git vendor/fynd"
}

Push-Location $fyndDir
try {
  $tychoUrl = if ($env:TYCHO_URL) { $env:TYCHO_URL } else { "tycho-fynd-ethereum.propellerheads.xyz" }
  $protocols = if ($env:FYND_PROTOCOLS) { $env:FYND_PROTOCOLS } else { "uniswap_v2,uniswap_v3,vm:balancer_v2" }
  $binary = ".\target\debug\fynd.exe"

  if (-not (Test-Path $binary)) {
    cargo build --bin fynd
  }

  & $binary serve --tycho-url $tychoUrl --protocols $protocols
}
finally {
  Pop-Location
}

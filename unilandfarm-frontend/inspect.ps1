Add-Type -AssemblyName System.Drawing

$img1 = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\public\assets\screenshot_dashboard.png")
Write-Host "Dashboard: $($img1.Width)x$($img1.Height)"
$img1.Dispose()

$img2 = [System.Drawing.Bitmap]::FromFile("$PSScriptRoot\public\assets\screenshot_cms.jpg")
Write-Host "CMS: $($img2.Width)x$($img2.Height)"
$img2.Dispose()

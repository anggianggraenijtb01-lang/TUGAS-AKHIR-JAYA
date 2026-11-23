Add-Type -AssemblyName System.Drawing
$imagePath = (Resolve-Path "public\assets\clay_elements.jpg").Path
$img = [System.Drawing.Image]::FromFile($imagePath)
Write-Output "Image Dimensions: $($img.Width) x $($img.Height)"
$img.Dispose()

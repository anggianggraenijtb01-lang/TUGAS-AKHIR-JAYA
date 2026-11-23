Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $x, $y, $w, $h) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dest = $src.Clone($rect, $src.PixelFormat)
    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $dest.Dispose()
    $src.Dispose()
    Write-Host "Cropped successfully"
}

# Crop coffee hero image from CMS screenshot (1024x640)
# Canvas is from x=206, y=60 to x=800, y=630.
# Hero image is x=212, y=142, w=584, h=280
Crop-Image "$PSScriptRoot\public\assets\screenshot_cms.jpg" "$PSScriptRoot\public\assets\coffee_hero_bg.jpg" 212 142 584 280

# Crop coffee thumb from dashboard screenshot (1024x576)
# Coffee thumbnail is in the "Website Aktif" card: x=215, y=283, w=95, h=68 approx
Crop-Image "$PSScriptRoot\public\assets\screenshot_dashboard.png" "$PSScriptRoot\public\assets\coffee_thumb.jpg" 215 283 95 68

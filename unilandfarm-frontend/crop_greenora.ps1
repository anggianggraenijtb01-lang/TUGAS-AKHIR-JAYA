Add-Type -AssemblyName System.Drawing

$srcPath = "public\assets\greenora_mockup_full.png"
$img = [System.Drawing.Bitmap]::FromFile((Resolve-Path $srcPath).Path)

function CropImage($name, $x, $y, $w, $h) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $dest = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $dest.Save("public\assets\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Output "Saved $name.png (${w}x${h})"
}

# Hero Photo on Right
# From visual inspection: x: 570, y: 135, w: 366, h: 260
CropImage "greenora_hero_photo" 570 135 370 260

# 4 Products
# Product 1
CropImage "greenora_prod_1" 65 585 200 155
# Product 2
CropImage "greenora_prod_2" 288 585 200 155
# Product 3
CropImage "greenora_prod_3" 520 585 200 155
# Product 4
CropImage "greenora_prod_4" 750 585 200 155

$img.Dispose()

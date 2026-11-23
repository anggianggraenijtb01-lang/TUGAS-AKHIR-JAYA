Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public\assets\clay_elements.jpg").Path
$outDir = "public\assets\elements"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

$srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

function CropAndMakeTransparent($name, $x, $y, $w, $h, $makeTransparent = $true) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $destBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $g.DrawImage($srcBmp, $destRect, $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    if ($makeTransparent) {
        # Background color is cream around R=247-253, G=242-249, B=226-236
        for ($px = 0; $px -lt $w; $px++) {
            for ($py = 0; $py -lt $h; $py++) {
                $c = $destBmp.GetPixel($px, $py)
                # Check distance from cream background (249, 245, 230)
                $dr = [Math]::Abs($c.R - 249)
                $dg = [Math]::Abs($c.G - 245)
                $db = [Math]::Abs($c.B - 230)
                
                # If very close to background cream
                if ($dr -lt 15 -and $dg -lt 15 -and $db -lt 15) {
                    $destBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                } elseif ($dr -lt 25 -and $dg -lt 25 -and $db -lt 25) {
                    # Soft edge blend
                    $alpha = [int]([Math]::Max(0, [Math]::Min(255, (($dr + $dg + $db) - 45) * 8)))
                    $destBmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
                }
            }
        }
    }

    $destPath = Join-Path $outDir "$name.png"
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()
    Write-Output "Saved $name.png"
}

# Define element crops based on 1024 x 682
# 1. Farmer Character with speech bubble
CropAndMakeTransparent "farmer_character" 350 535 205 138 $true
CropAndMakeTransparent "farmer_only" 355 538 105 135 $true
CropAndMakeTransparent "farmer_bubble" 455 548 95 80 $true

# 2. Market stall & garden tools
CropAndMakeTransparent "market_stall" 672 250 100 110 $true
CropAndMakeTransparent "wooden_sign" 772 250 82 110 $true
CropAndMakeTransparent "watering_can" 905 272 82 82 $true
CropAndMakeTransparent "seedling_sprout" 852 268 60 85 $true

# 3. Fruits & Vegetables
CropAndMakeTransparent "avocado" 368 382 62 75 $true
CropAndMakeTransparent "strawberry" 437 384 60 72 $true
CropAndMakeTransparent "corn" 498 378 60 80 $true
CropAndMakeTransparent "veggie_crate" 368 456 106 63 $true
CropAndMakeTransparent "seed_sack" 482 462 68 56 $true

# 4. Badges & Labels
CropAndMakeTransparent "badge_ai_generated" 15 252 125 45 $true
CropAndMakeTransparent "badge_instant" 142 252 68 45 $true
CropAndMakeTransparent "badge_popular" 214 252 70 45 $true
CropAndMakeTransparent "badge_new" 288 252 56 45 $true

# 5. Stars & Sparkles
CropAndMakeTransparent "star_puffy_orange" 18 35 48 55 $true
CropAndMakeTransparent "star_gold_round" 72 38 48 52 $true
CropAndMakeTransparent "star_sparkle_3d" 178 35 50 60 $true
CropAndMakeTransparent "star_sparkle_green" 18 95 48 52 $true
CropAndMakeTransparent "sparkle_cross" 178 95 48 50 $true
CropAndMakeTransparent "sparkle_burst" 122 150 45 50 $true

# 6. Leaves & Plants
CropAndMakeTransparent "leaf_single_big" 255 35 60 85 $true
CropAndMakeTransparent "leaf_pair_sprout" 318 48 40 65 $true
CropAndMakeTransparent "leaf_branch_lush" 430 35 80 110 $true
CropAndMakeTransparent "leaf_double_tall" 312 115 105 95 $true
CropAndMakeTransparent "leaf_vine_branch" 15 540 160 45 $true

# 7. Decorative arrows & other
CropAndMakeTransparent "arrow_orange_loop" 595 80 70 55 $true
CropAndMakeTransparent "arrow_curved_up" 600 135 68 50 $true
CropAndMakeTransparent "paper_airplane" 625 550 85 68 $true
CropAndMakeTransparent "shopping_bag" 822 546 55 68 $true
CropAndMakeTransparent "clay_heart" 880 555 45 45 $true
CropAndMakeTransparent "button_mulai" 15 380 140 45 $true
CropAndMakeTransparent "divider_star" 18 585 295 28 $true

$srcBmp.Dispose()
Write-Output "All clay elements cropped successfully!"

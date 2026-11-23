Add-Type -AssemblyName System.Drawing

$outDir = "public\assets\3d"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

function RemovePureWhiteBackground($srcPath, $destName) {
    if (-not (Test-Path $srcPath)) {
        Write-Warning "File not found: $srcPath"
        return
    }

    $srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
    $w = $srcBmp.Width
    $h = $srcBmp.Height
    $destBmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    # Process pixels: if near white (R>245, G>245, B>245)
    for ($x = 0; $x -lt $w; $x++) {
        for ($y = 0; $y -lt $h; $y++) {
            $c = $srcBmp.GetPixel($x, $y)
            $r = $c.R
            $g = $c.G
            $b = $c.B
            
            $minVal = [Math]::Min($r, [Math]::Min($g, $b))
            
            if ($minVal -ge 250) {
                # Pure white -> transparent
                $destBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($minVal -ge 235) {
                # Soft transition at the boundary
                $alpha = [int]([Math]::Max(0, [Math]::Min(255, (250 - $minVal) * 17)))
                $destBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
            } else {
                $destBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            }
        }
    }

    $destPath = Join-Path $outDir "$destName.png"
    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $srcBmp.Dispose()
    $destBmp.Dispose()
    Write-Output "Successfully processed $destName.png"
}

RemovePureWhiteBackground "C:\Users\acer\.gemini\antigravity-ide\brain\56e9bfc2-c8fd-4f00-9ca5-704f0a5d626d\clay_orange_star_1792285411421.jpg" "star_3d"
RemovePureWhiteBackground "C:\Users\acer\.gemini\antigravity-ide\brain\56e9bfc2-c8fd-4f00-9ca5-704f0a5d626d\clay_farmer_3d_1792285460008.jpg" "farmer_3d"
RemovePureWhiteBackground "C:\Users\acer\.gemini\antigravity-ide\brain\56e9bfc2-c8fd-4f00-9ca5-704f0a5d626d\clay_leaf_branch_1792285637912.jpg" "leaves_3d"

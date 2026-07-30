Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\Usuario\.gemini\antigravity-ide\brain\62f4b2a9-9b9e-4f14-9761-618688d0387c\media__1785455568989.jpg"
$destPath = "C:\Users\Usuario\OneDrive\Desktop\Mate de a dos pagina oficial\mate-de-a-dos\public\images\logo.png"

$img = [System.Drawing.Bitmap]::FromFile($sourcePath)
$target = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

for ($x = 0; $x -lt $img.Width; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $pixel = $img.GetPixel($x, $y)
        $r = $pixel.R
        $g = $pixel.G
        $b = $pixel.B

        # Eliminar cuadricula gris y blanca de falsa transparencia
        if (($r -gt 170 -and $g -gt 170 -and $b -gt 170) -and ([Math]::Abs($r - $g) -lt 20) -and ([Math]::Abs($g - $b) -lt 20)) {
            $target.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
        } else {
            $target.SetPixel($x, $y, $pixel)
        }
    }
}

$target.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
$target.Dispose()
Write-Host "Logo transparente generado con exito."

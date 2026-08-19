$target = "c:\Projects\geoHY-website\docs\outreach_email_template.md"
$content = Get-Content $target -Raw
$sig = "**Babu Priyavrat** — Co-Founder & Commercial Lead`r`n**Alan Filipov** — Co-Founder & Technical Lead"

$content = $content -replace "(?m)^\[Your Full Name\]\r?\nFounder & CEO, GeoHY", $sig
$content = $content -replace "(?m)^\[Your Full Name\]\r?\nGeoHY \| \[Email\] \| \[Phone\]", "$sig`r`n[Email] | [Phone]"

Set-Content $target $content

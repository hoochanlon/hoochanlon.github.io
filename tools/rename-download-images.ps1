# cd "C:\Users\hooch\Downloads"
# $counter = 1
# $prefix = "yogioh" 

# Get-ChildItem -File | Where-Object { $_.Extension -match '\.png|\.webp|\.jpg|\.jpeg' } | ForEach-Object {
#     $timestamp = Get-Date -Format "yyyyMMddHHmm"
#     $newName = "$prefix-$timestamp-$counter$($_.Extension)"  
#     Rename-Item $_.FullName -NewName $newName
#     $counter++  
# }

cd "C:\Users\hooch\Downloads"
$counter = 1
$prefix = "yogioh"

Get-ChildItem -File | Where-Object { $_.Extension -match '\.png|\.webp|\.jpg|\.jpeg' } | ForEach-Object {
    $timestamp = Get-Date -Format "yyyyMMddHHmm"
    $newName = "$prefix-$timestamp-$counter.png" 
    $newFilePath = Join-Path $_.DirectoryName $newName
    Rename-Item $_.FullName -NewName $newFilePath
    $counter++  
}

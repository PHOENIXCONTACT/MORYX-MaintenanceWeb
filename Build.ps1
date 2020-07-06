param (
    [switch]$SetAssemblyVersion,
    [switch]$Build,
    [switch]$BuildHtml,

    [switch]$GenerateDocs,

    [switch]$Pack,
    [switch]$Publish
)

# Load Toolkit
. ".build\BuildToolkit.ps1"

# Initialize Toolkit
Invoke-Initialize -Version (Get-Content "VERSION");

if ($SetAssemblyVersion) {
    # Patch version
    $versionFile = "src\Moryx.Runtime.Maintenance.Web.UI\src\Version.ts"
    (Get-Content $versionFile) | Foreach-Object {
        $_ -replace '%VERSION%', "$env:MORYX_VERSION"
    } | Set-Content $versionFile

    Set-AssemblyVersions;
}

if ($BuildHtml) {
    cd src/Moryx.Runtime.Maintenance.Web.UI
    npm run build
    mkdir -p ../../artifacts/web
    cp -R dist/* ../../artifacts/web/
}

if ($Build) {
    Invoke-Build ".\Maintenance.Web.sln"
}

if ($GenerateDocs) {
    Invoke-DocFx
}

if ($Pack) {
    Invoke-PackAll -Symbols
}

if ($Publish) {
    Invoke-Publish
}

Write-Host "Success!"
param(
    [Parameter(Mandatory = $true)]
    [string]$AppName,

    [Parameter(Mandatory = $true)]
    [string]$ResourceGroup,

    [Parameter()]
    [string]$ProjectPath = "src/backend/WorkoutTracker.Api"
)

$ErrorActionPreference = "Stop"

Write-Host "Publishing .NET API..." -ForegroundColor Cyan
dotnet publish $ProjectPath -c Release -o publish-fd

Write-Host "Creating deploy zip..." -ForegroundColor Cyan
if (Test-Path deploy.zip) { Remove-Item deploy.zip -Force }
Compress-Archive -Path publish-fd/* -DestinationPath deploy.zip -Force

Write-Host "Deploying to Azure App Service..." -ForegroundColor Cyan
az webapp deploy --name $AppName --resource-group $ResourceGroup --type zip --src-path deploy.zip

Write-Host "Cleaning up..." -ForegroundColor Cyan
Remove-Item publish-fd -Recurse -Force
Remove-Item deploy.zip -Force

$url = "https://$AppName.azurewebsites.net/api/exercises"
Write-Host "Deployed! Test at: $url" -ForegroundColor Green

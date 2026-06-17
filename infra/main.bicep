param location string = resourceGroup().location
param appName string = 'workout-tracker-api'
param sku string = 'F1'

resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: '${appName}-plan'
  location: location
  sku: {
    name: sku
    tier: 'Free'
  }
}

resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
  }
}

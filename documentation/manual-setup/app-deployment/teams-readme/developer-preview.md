# Developer Preview

Developer preview provides users access to unreleased features in Teams. For more information, please check out [this Microsoft doc page](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/dev-preview/developer-preview-intro). You can refer to [this page](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema) for more information on manifest schemas.

To enable developer preview, you will need to:
 1. Change the `$schema` value in your `/teams-app-package/manifest.json` file to the developer preview version (refer to [Developer Preview manifest.json](#developer-preview-manifestjson))
 2. Change the `manifestVersion` value in your `/teams-app-package/manifest.json` file to `devPreview`
 3. Restart MS Teams with the developer preview setting

## Default manifest.json for Bridge

```json
{
  "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.8/MicrosoftTeams.schema.json",
  "manifestVersion": "1.8"
}
```

## Developer Preview manifest.json

```json
{
  "$schema": "https://raw.githubusercontent.com/OfficeDev/microsoft-teams-app-schema/preview/DevPreview/MicrosoftTeams.schema.json",
  "manifestVersion": "devPreview"
}
```
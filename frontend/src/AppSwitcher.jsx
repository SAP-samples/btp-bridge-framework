import { App as TeamsApp } from "./components/microsoftTeams/App";
import { App as GoogleApp } from "./components/googleChat/App";

export default function AppSwitcher({ integrationType }) {
  switch (integrationType) {
    case "googleChat":
      return (
        <GoogleApp
          configUrl={process.env.REACT_APP_CONFIG_URL}
          backendUrl={process.env.REACT_APP_BACKEND_URL}
          integrationType={integrationType}
        />
      );
    case "microsoftTeams":
      return (
        <TeamsApp
          configUrl={process.env.REACT_APP_CONFIG_URL}
          backendUrl={process.env.REACT_APP_BACKEND_URL}
          integrationType={integrationType}
        />
      );
    default:
      return (
        <h1>
          Invalid integration type. Valid integration types are "microsoftTeams"
          and "googleChat".
        </h1>
      );
  }
}

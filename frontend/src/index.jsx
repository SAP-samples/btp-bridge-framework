import React from "react";
import ReactDOM from "react-dom";
import AppSwitcher from "./AppSwitcher";
import * as microsoftTeams from "@microsoft/teams-js";
import { BrowserRouter } from "react-router-dom";
import { TargetSpaceProvider } from "./components/helpers";

// Initialize the Microsoft Teams SDK
microsoftTeams.initialize();

ReactDOM.render(
  <BrowserRouter>
    <TargetSpaceProvider>
      <AppSwitcher integrationType={process.env.REACT_APP_INTEGRATION_TYPE} />
    </TargetSpaceProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

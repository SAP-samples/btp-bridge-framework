// React imports
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader as MSLoader } from "@fluentui/react-northstar";
import "./App.css";

// Utility imports
import Page from "./Page";
import * as helper from "../helpers";
import LandingPage from "./LandingPage";

export function App(props) {
  const [pageConfig, setPageConfig] = useState({});
  const [simpleConfigIndex, setSimpleConfigIndex] = useState({});
  const [simpleConfig, setSimpleConfig] = useState({});
  const [authToken, setAuthToken] = useState("");

  /** ----------------------- Getting page configurations from static webserver -----------------------*/
  useEffect(() => {
    helper
      .getSimpleConfig(`${props.configUrl}/frontend/simpleConfig/`, "")
      .then((pages) => {
        setSimpleConfigIndex({ pages: pages });
      })
      .catch((error) => {
        console.error("error getting simple config", error);
      });
  }, [props.configUrl]);

  useEffect(() => {
    helper
      .getData(`${props.configUrl}/frontend/landingPageConfig.json`, null, null)
      .then((data) => {
        setPageConfig((prevState) => ({
          ...prevState,
          [data.id]: data,
        }));
      });
  }, [props.configUrl]);

  // Simple Config
  useEffect(() => {
    try {
      simpleConfigIndex?.pages?.forEach((page) => {
        helper
          .getData(
            `${props.configUrl}/frontend/simpleConfig/${page}`,
            null,
            null
          )
          .then((data) => {
            setSimpleConfig((prevState) => ({
              ...prevState,
              [data.system +
              data.interface +
              data.businessObject.split("/").pop() +
              data.pageType]: data,
            }));
          });
      });
    } catch (error) {
      console.log("Error: ", error);
    }
  }, [simpleConfigIndex, props.configUrl]);

  // Dynamically creating routes based on all the manifest files from static
  // webserver.
  return (
    <div
      style={{
        backgroundColor: "#F5F6F7",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Routes>
        {/* && authToken  */}
        {pageConfig.landingPageConfig ? (
          <>
            <Route
              key="-1"
              path="/"
              element={
                <LandingPage pageConfig={pageConfig.landingPageConfig} />
              }
            />

            {Object.keys(simpleConfig).map((c, i) => {
              return (
                <Route
                  key={i}
                  path={
                    "/" +
                    simpleConfig[c].system +
                    "/" +
                    simpleConfig[c].interface +
                    "/" +
                    simpleConfig[c].businessObject.split("/").pop() +
                    simpleConfig[c].pageType
                  }
                  element={
                    <Page
                      config={simpleConfig[c]}
                      key={1000 + i}
                      authToken={authToken}
                      backendUrl={`${props.backendUrl}/gateway`}
                      integrationType={props.integrationType}
                    />
                  }
                />
              );
            })}
          </>
        ) : (
          <>
            <Route path="/" element={<MSLoader label="Loading..." />} />
          </>
        )}
      </Routes>
    </div>
  );
}

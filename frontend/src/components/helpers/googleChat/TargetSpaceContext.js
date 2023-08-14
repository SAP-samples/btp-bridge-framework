import React from "react";

const TargetSpaceContext = React.createContext();

const defaultTargetSpace = "";

export function TargetSpaceProvider({ children }) {
  const [targetSpace, setTargetSpace] = React.useState(defaultTargetSpace);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const targetSpaceParam = params.get("targetSpace");

    if (targetSpaceParam) {
      setTargetSpace(targetSpaceParam);
    }
  }, []);

  return (
    <TargetSpaceContext.Provider value={{ targetSpace, setTargetSpace }}>
      {children}
    </TargetSpaceContext.Provider>
  );
}

export function useTargetSpace() {
  const context = React.useContext(TargetSpaceContext);
  if (!context) {
    throw new Error("useTargetSpace must be used within a TargetSpaceProvider");
  }
  return context;
}

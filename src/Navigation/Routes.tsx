import React from "react";
import { useEffect, useReducer, useState } from "react";
import NotFound from "../NotFound/NotFound";
import { RoutePaths } from "./RoutePaths";

// Built with inspiration from: https://ogzhanolguncu.com/blog/build-a-custom-react-router-from-scratch
export const PathContext = React.createContext({
    currentPath: window.location.pathname,
});

const Routes = ({ paths, children  } : { paths : RoutePaths, children : React.ReactNode  }) => {
  const [routePaths] = useState(Object.keys(paths).map((key) => paths[key].routePath));
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

  const isPathValid = routePaths.indexOf(currentPath) !== -1;

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };    
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  return (
    <PathContext.Provider value={{currentPath}}>
    {isPathValid ? children  : <NotFound/>}
    </PathContext.Provider>
    );
};

export default Routes;
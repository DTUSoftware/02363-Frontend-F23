import { useEffect, useState } from "react";

// Build using inspiration from https://dev.to/franciscomendes10866/create-your-own-react-router-53ng
const Route = ({ path, element } : { path : string, element: JSX.Element  }) => {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };    
    window.addEventListener("navigate", onLocationChange);
    return () => window.removeEventListener("navigate", onLocationChange);
  }, []);

  return (
    currentPath === path 
    ? 
    element : null);
};

export default Route;
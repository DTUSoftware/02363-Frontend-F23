import {createContext, ReactNode} from "react";
import { useEffect, useState } from "react";
import NotFound from "../NotFound/NotFound";
import navigate from "./navigate";
import { RoutePaths } from "./RoutePaths";

/**
 * PathContext with defaultValue as the current URL location pathname
 */
export const PathContext = createContext(window.location.pathname);

/**
 * Routes component used to hold currentPath state and handle popstate events
 * ReactNode children (in the form of Route components) are passed to PathContext.Provider with value currentPath
 * Built with inspiration from: https://ogzhanolguncu.com/blog/build-a-custom-react-router-from-scratch
 */
const Routes = ({
    paths,
    children,
}: {
    paths: RoutePaths;
    children: ReactNode;
}) => {

    // routePaths string[] contains all the possible application routes
    const [routePaths] = useState(
        Object.keys(paths).map((key) => paths[key].routePath)
    );

    // useState hook to hold the current location path
    const [currentPath, setCurrentPath] = useState<string>(
        window.location.pathname
    );

    // Checks that the currentPath is part of the routePaths application routes
    const isPathValid = routePaths.indexOf(currentPath) !== -1;

    // useEffect hook with popstate eventlistener that triggers an onLocationChange callback to set currentPath
    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener("popstate", onLocationChange);
        return () => window.removeEventListener("popstate", onLocationChange);
    }, []);

    // useEffect hook that initially navigates the user to the home route if currentPath is not the home or login routePath
    useEffect(() => {
        if (currentPath !== paths.home.routePath && currentPath !== paths.login.routePath && isPathValid) {
            navigate(paths.home.routePath);
        }
    }, []);

    return (
        <PathContext.Provider value={currentPath}>
            {isPathValid ? children : <NotFound />}
        </PathContext.Provider>
    );
};

export default Routes;

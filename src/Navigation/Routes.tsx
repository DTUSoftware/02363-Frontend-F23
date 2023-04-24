import {createContext, ReactNode} from "react";
import { useEffect, useState } from "react";
import NotFound from "../NotFound/NotFound";
import navigate from "./navigate";
import { RoutePaths } from "./RoutePaths";

// Built with inspiration from: https://ogzhanolguncu.com/blog/build-a-custom-react-router-from-scratch
export const PathContext = createContext(window.location.pathname);

const Routes = ({
    paths,
    children,
}: {
    paths: RoutePaths;
    children: ReactNode;
}) => {
    const [routePaths] = useState(
        Object.keys(paths).map((key) => paths[key].routePath)
    );
    const [currentPath, setCurrentPath] = useState<string>(
        window.location.pathname
    );

    const isPathValid = routePaths.indexOf(currentPath) !== -1;

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        };
        window.addEventListener("popstate", onLocationChange);
        return () => window.removeEventListener("popstate", onLocationChange);
    }, []);

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

import { useContext } from "react";
import { PathContext } from "./Routes";

/**
 * Route component used to display a page component if its path is equal to that from the current PathContext value
 */
const Route = ({ path, element }: { path: string; element: JSX.Element }) => {
    const currentPath = useContext(PathContext);

    return currentPath === path ? element : null;
};

export default Route;

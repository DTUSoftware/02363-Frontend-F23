import { useContext } from "react";
import { PathContext } from "./Routes";

const Route = ({ path, element }: { path: string; element: JSX.Element }) => {
    const currentPath = useContext(PathContext);

    return currentPath === path ? element : null;
};

export default Route;

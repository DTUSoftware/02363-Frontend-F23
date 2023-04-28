import navigate from "../Navigation/navigate";
import { routes } from "../Navigation/RoutePaths";
import "./NotFound.css";

/**
 * NotFound page component, shown to the user when they access destination that is not part of the application routes
 */
function NotFound() {

    // onCLick function for navigation the user back to the home routePath
    const backToShop = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(routes.home.routePath);
    };

    return (
        <div className="notfound-box">
            <h2>Hov... du er vist kommet på afveje!</h2>
            <div className="notfound-message">
                <p>Denne side eksisterer ikke endnu.</p>
            </div>
            <button onClick={backToShop}>Tilbage til shop</button>
        </div>
    );
}

export default NotFound;
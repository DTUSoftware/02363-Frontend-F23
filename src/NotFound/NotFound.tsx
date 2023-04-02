import navigate from "../Navigation/navigate";
import { routes } from "../Navigation/RoutePaths";
import "./NotFound.css";

function NotFound() {
    const continueShopping = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(routes.home.routePath);
    };

    return (
        <div className="notfound-box">
            <h2>Hov... du er vist kommet på afveje!</h2>
            <div className="notfound-message">
                <p>Denne side eksisterer ikke endnu.</p>
            </div>
            <button onClick={continueShopping}>Tilbage til shop</button>
        </div>
    );
}

export default NotFound;
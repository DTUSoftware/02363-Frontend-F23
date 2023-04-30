import { routes } from "../Navigation/RoutePaths";
import "./Finish.css";

/**
 * Finish page component, shown to the user at the end of a successful checkout flow
 */
function Finish() {
    
    // Button onClick function for navigating back to the home route whilst reloading the page
    const continueShopping = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        window.location.replace(routes.home.routePath);
    };

    return (
        <div className="finish-box">
            <h2>Mange tak!</h2>
            <div className="finish-message">
                <p>Din er order er nu bestilt.</p>
                <p>Tjek din email for kvittering.</p>
            </div>
            <button onClick={continueShopping}>Shop videre?</button>
        </div>
    );
}

export default Finish;

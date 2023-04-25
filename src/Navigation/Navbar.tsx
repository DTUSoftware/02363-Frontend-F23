import { FaShoppingCart, FaUserAlt} from "react-icons/fa";
import "./Navbar.css";
import Link from "./Link";
import  "./Navbar.css"
import { routes } from "./RoutePaths";
import { DescopeSdkType } from "../interfaces/DescopeSdkType"

const Navbar = ({user, descopeSdk}:{user: string, descopeSdk: DescopeSdkType}) => {

    async function userLogout() {
        await descopeSdk.logout();
    }

    return (        
        <nav className="navbar">
            <label className="logo">Shopping App</label>
            <ul className="nav-content">
                <li>
                    <Link to={routes.home.routePath} className="nav-button">Produkter</Link>
                </li>
                <li>
                    <Link to={routes.cart.routePath} className="nav-button"> <><FaShoppingCart/> Kurv </> </Link>
                </li>
                <li>
                    <Link to={routes.login.routePath} className="nav-button">{!user ? (<>Login</>) : (<> Account <FaUserAlt/> </>)} </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
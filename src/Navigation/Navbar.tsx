import { FaShoppingCart, FaUserAlt} from "react-icons/fa";
import "./Navbar.css";
import Link from "./Link";
import  "./Navbar.css"
import { routes } from "./RoutePaths";
import { DescopeSdkType } from "../interfaces/DescopeSdkType"

const Navbar = ({user}:{user: string, descopeSdk: DescopeSdkType}) => {

    return (        
        <nav className="navbar">
            <label className="logo">Shopping App</label>
            <ul className="nav-content">
                <li>
                    <Link location={routes.home.routePath} className="nav-button">Produkter</Link>
                </li>
                <li>
                    <Link location={routes.cart.routePath} className="nav-button"> <> <FaShoppingCart/> Kurv </> </Link>
                </li>
                <li>
                    <Link location={routes.login.routePath} className="nav-button">{!user ? (<>Log ind</>) : (<> <FaUserAlt/> Bruger </>)} </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
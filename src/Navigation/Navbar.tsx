import { FaShoppingCart} from "react-icons/fa";
import "./Navbar.css";
import Link from "./Link";
import  "./Navbar.css"

const Navbar = () => {
    return (        
        <nav className="navbar">
            <label className="logo">Shopping App</label>
            <ul className="nav-content">
                <li>
                    <Link to="/" className="nav-button">Produkter</Link>
                </li>
                <li>
                    <Link to="/cart" className="nav-button"> <><FaShoppingCart/> Kurv </> </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

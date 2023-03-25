import { Link } from "react-router-dom";
import { FaShoppingCart} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
    return (        
        <nav className="navbar">
            <label className="logo">Shopping App</label>
            <ul className="nav-content">
                <li>
                    <Link to="/"> 
                        <button className="nav-button"> Produkter </button>
                    </Link>
                </li>
                <li>
                    <Link to="/cart">
                        <button className="nav-button"> <FaShoppingCart/> Kurv </button>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;

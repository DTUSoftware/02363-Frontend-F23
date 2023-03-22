import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-content">
                <Link to="/">
                    <button className="nav-button">1. Produkter</button>
                </Link>
                <Link to="/cart">
                    <button className="nav-button">2. Kurv</button>
                </Link>
            </ul>
        </nav>
    );
};

export default Navbar;

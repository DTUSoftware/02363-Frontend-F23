import { Link } from "react-router-dom";
import  "./Navbar.css"

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <ul className="nav-content">
                <Link to="/">Produkter</Link>
                <Link to="/cart">kurv</Link>             
            </ul>
        </nav>
     );
}
 
export default Navbar;
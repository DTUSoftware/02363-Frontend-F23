import { Link } from "react-router-dom";
import  "./Navbar.css"

const Navbar = () => {
    return ( 
        <nav className="navbar">
            <h2>Shopping-app</h2>
            <ul className="nav-content">
                <Link to="/">Cart</Link>                
            </ul>
        </nav>
     );
}
 
export default Navbar;
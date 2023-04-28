import { useEffect, useState } from "react";
import { CartItem } from "./interfaces/CartItem";
import { Address } from "./interfaces/Address";
import ShoppingList from "./ShoppingList/ShoppingList";
import "./App.css";
import Navbar from "./Navigation/Navbar";
import Delivery from "./Delivery/Delivery";
import Submit from "./Submit/Submit";
import ProductList from "./ProductList/ProductList";
import Payment from "./Payment/Payment";
import Finish from "./Finish/Finish";
import Route from "./Navigation/Route";
import Routes from "./Navigation/Routes";
import { routes } from "./Navigation/RoutePaths";
import { Products } from "./interfaces/Products";
import Login, { userLogin } from "./Login/Login";
import DescopeSdk from "@descope/web-js-sdk";

// DescopeSdk instantiation using projectId string
const descopeSdk = DescopeSdk({ projectId: "P2OsrcDOTW2jFz7Wq9Sxks54JSx3" });

// Searches for URL parameter with the name 't' containing the token provided by Descope after magic link login
const descopeToken = new URLSearchParams(window.location.search).get("t");

// Address declaration with initial values
const address: Address = {
    firstName: "",
    lastName: "",
    email: "",
    mobileNr: 0,
    company: "",
    vatNr: "",
    country: "Danmark",
    zipCode: "",
    city: "",
    address1: "",
    address2: "",
};

/**
 * App top level component
 */
function App() {

    // useState hooks used throughout the application components
    const [user, setUser] = useState("");
    const [items, setItems] = useState<CartItem[]>([]);
    const [productList, setList] = useState<Products>({});
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const [check, setCheck] = useState(false);

    // useEffect for logging the user in when a Descope token is provided after magic link login
    useEffect(() => {
        if (descopeToken !== null) {
            userLogin(descopeSdk, descopeToken, setUser);
        }
    }, [descopeToken]);

    // Function for resetting application state after an order has been submitted
    const resetAfterSubmit = () => {
        setItems([]);
        setBilling(address);
        setShipping(address);
        setCheck(false);
    };

    return (
        <div className="App">
            <Navbar user={user} descopeSdk={descopeSdk} />
            <div className="content">
                <Routes paths={routes}>
                    <Route
                        path={routes.home.routePath}
                        element={
                            <ProductList
                                items={items}
                                setItems={setItems}
                                setList={setList}
                            />
                        }
                    />
                    <Route
                        path={routes.cart.routePath}
                        element={
                            <ShoppingList
                                items={items}
                                setItems={setItems}
                                productList={productList}
                            />
                        }
                    />
                    <Route
                        path={routes.delivery.routePath}
                        element={
                            <Delivery
                                billingAddress={billingAddress}
                                setBilling={setBilling}
                                shippingAddress={shippingAddress}
                                setShipping={setShipping}
                                address={address}
                                check={check}
                                setCheck={setCheck}
                            />
                        }
                    />
                    <Route
                        path={routes.payment.routePath}
                        element={<Payment />}
                    />
                    <Route
                        path={routes.submit.routePath}
                        element={
                            <Submit
                                cartItems={items}
                                billingAddress={billingAddress}
                                shippingAddress={shippingAddress}
                                resetAfterSubmit={resetAfterSubmit}
                            />
                        }
                    />
                    <Route
                        path={routes.finish.routePath}
                        element={<Finish />}
                    />
                    <Route
                        path={routes.login.routePath}
                        element={
                            <Login
                                descopeSdk={descopeSdk}
                                user={user}
                                descopeToken={descopeToken}
                            />
                        }
                    />
                </Routes>
            </div>
        </div>
    );
}

export default App;

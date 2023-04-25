import { useState } from "react";
import { CartItem } from './interfaces/CartItem';
import { Address } from './interfaces/Address';
import ShoppingList from './ShoppingList/ShoppingList'
import './App.css'
import Navbar from './Navigation/Navbar'
import Delivery from './Delivery/Delivery'
import Submit from './Submit/Submit'
import ProductList from './ProductList/ProductList'
import Payment from './Payment/Payment'
import { ProductItem } from './interfaces/ProductItem';
import Finish from "./Finish/Finish";
import Route from "./Navigation/Route";
import Routes from "./Navigation/Routes";
import { routes } from "./Navigation/RoutePaths";
import { Products } from "./interfaces/Products";
import Login from "./Login/Login";
import DescopeSdk from '@descope/web-js-sdk';

const descopeSdk = DescopeSdk({ projectId: "P2OsrcDOTW2jFz7Wq9Sxks54JSx3" });
const descopeToken = new URLSearchParams(window.location.search).get("t");

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

function App() {
    const [user, setUser] = useState("");

    const [items, setItems] = useState<CartItem[]>([]);
    const [productList, setList] = useState<Products>({});
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const [check, setCheck] = useState(false);

    const resetAfterSubmit = () => {
        setItems([]);
        setBilling(address);
        setShipping(address);
        setCheck(false);
    }

    return (
        <div className="App">
            <Navbar user={user} descopeSdk={descopeSdk}/>
            <div className="content"> 
                <Routes paths={routes}>        
                    <Route path={routes.home.routePath} element= { <ProductList items={items} setItems={setItems} setList={setList}/> } />
                    <Route path={routes.cart.routePath} element= { <ShoppingList items={items} setItems={setItems} productList={productList}/> } />
                    <Route path={routes.delivery.routePath} element={<Delivery billingAddress={billingAddress} setBilling={setBilling} shippingAddress={shippingAddress} setShipping={setShipping} address={address} check={check} setCheck={setCheck}/>}/>
                    <Route path={routes.payment.routePath} element={<Payment/>}/>
                    <Route path={routes.submit.routePath} element={<Submit cartItems={items} billingAddress={billingAddress} shippingAddress={shippingAddress} resetAfterSubmit={resetAfterSubmit}/>}/>
                    <Route path={routes.finish.routePath} element={<Finish/>} /> 
                    <Route path={routes.login.routePath} element={<Login descopeSdk={descopeSdk} user={user} setUser={setUser} descopeToken={descopeToken}/>} />  
                </Routes>               
            </div>
        </div>
    )
}

export default App

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

type Products = { [key: string]: ProductItem };

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
            <Navbar/>
            <div className="content"> 
                <Routes paths={routes}>        
                    <Route path={routes.home.routePath} element= { <ProductList items={items} setItems={setItems} setList={setList}/> } />
                    <Route path={routes.cart.routePath} element= { <ShoppingList items={items} setItems={setItems} productList={productList}/> } />
                    <Route path={routes.delivery.routePath} element={<Delivery billingAddress={billingAddress} setBilling={setBilling} shippingAddress={shippingAddress} setShipping={setShipping} address={address} check={check} setCheck={setCheck}/>}/>
                    <Route path={routes.payment.routePath} element={<Payment/>}/>
                    <Route path={routes.submit.routePath} element={<Submit cartItems={items} billingAddress={billingAddress} shippingAddress={shippingAddress} resetAfterSubmit={resetAfterSubmit}/>}/>
                    <Route path={routes.finish.routePath} element={<Finish/>} />  
                </Routes>               
            </div>
        </div>
    )
}

export default App

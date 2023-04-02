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

type Products = { [key: string]: ProductItem };
import Finish from "./Finish/Finish";
import Route from "./Navigation/Route";

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
    const [productList, setList] = useState<Products>({})
    const [billingAddress, setBilling] = useState<Address>(address);
    const [shippingAddress, setShipping] = useState<Address>(address);
    const [check, setCheck] = useState(false);

    const resetAfterSubmit = () => {
        setItems([]);
        setBilling(address);
        setShipping(address);
        setCheck(false);
    }
    console.log(window.location.pathname);

    return (
        <div className="App">
            <Navbar/>
            <div className="content">          
                <Route path='/' element= { <ProductList items={items} setItems={setItems} setList={setList}/> } />
                <Route path='/cart' element= { <ShoppingList items={items} setItems={setItems} productList={productList}/> } />
                <Route path='/delivery' element={<Delivery billingAddress={billingAddress} setBilling={setBilling} shippingAddress={shippingAddress} setShipping={setShipping} address={address} check={check} setCheck={setCheck}/>}/>
                <Route path='/payment'element={<Payment/>}/>
                <Route path='/submit' element={<Submit cartItems={items} billingAddress={billingAddress} shippingAddress={shippingAddress} resetAfterSubmit={resetAfterSubmit}/>}/>
                <Route path='/finish' element={<Finish/>} />                
            </div>
        </div>
    )
}

export default App

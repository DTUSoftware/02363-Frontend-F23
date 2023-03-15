import ShoppingList from './ShoppingList/ShoppingList'
import './App.css'
import Navbar from './Navigation/Navbar'
import Delivery from './Delivery/Delivery'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import ProductList from './ProductList/ProductList'
import { CartItem } from './interfaces/CartItem'
import React from 'react'

function App() {
    const [basket, setBasket] = React.useState<CartItem[]>([]);

    return (
        <Router>
        <div className="App">
            <Navbar/>
            <div className="content">
                <Routes>
                    <Route path='/' element= { <ProductList basket={basket} setBasket={setBasket}/> } />
                    <Route path='/cart' element= { <ShoppingList items={basket} setItems={setBasket}/> } />
                    <Route path='/delivery' element={<Delivery/>}/>
                </Routes>                  
            </div>
        </div>
        </Router>
    )
}

export default App

import ShoppingList from './ShoppingList/ShoppingList'
import './App.css'
import Navbar from './Navigation/Navbar'
import Delivery from './Delivery/Delivery'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

function App() {
    return (
        <Router>
        <div className="App">
            <Navbar/>
            <div className="content">
                <Routes>
                    <Route path='/' element= { <ShoppingList/> } />
                    <Route path='/delivery' element={<Delivery/>}/>
                </Routes>                  
            </div>
        </div>
        </Router>
    )
}

export default App

import './App.css'
import Navbar from './Navbar'
import Delivery from './Delivery'
import ShoppingList from './ShoppingList'
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

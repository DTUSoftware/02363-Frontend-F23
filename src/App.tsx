import { useState } from 'react'
import ShoppingList from './ShoppingList'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <ShoppingList/>
    </div>
  )
}

export default App

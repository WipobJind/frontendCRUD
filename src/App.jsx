import { Routes, Route, Link } from 'react-router-dom'
import { Items } from './pages/Items'
import { ItemDetail } from './pages/ItemDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Item Management</h1>
        <nav><Link to="/">Home</Link></nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
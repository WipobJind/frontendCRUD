import { Routes, Route, Link } from 'react-router-dom'
import { Items } from './pages/Items'
import { ItemDetail } from './pages/ItemDetail'
import { Users } from './pages/Users'
import { UserDetail } from './pages/UserDetail'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Management System</h1>
        <nav>
          <Link to="/">Items</Link>
          <Link to="/users">Users</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
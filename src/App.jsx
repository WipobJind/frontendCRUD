import { Routes, Route, Link } from "react-router-dom";
import { useUser } from "./contexts/UserProvider";
import RequireAuth from "./middleware/RequireAuth";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const { user } = useUser();

  return (
    <div className="app">
      <header>
        <h1>User Profile Management</h1>
        <nav>
          {user.isLoggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/logout">Logout</Link>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

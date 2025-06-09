// Main application component that sets up routing and navigation using React Router.

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Component imports
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import { AlbumDetails } from "./components/AlbumDetails";
import { AuthContext } from './components/AuthContext';

function App() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  // Logs out the user and redirects to home
  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Router>
      {/* Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-title">
          <Link to="/" className="tuned-title">Tuned</Link>
        </div>
        <div className="nav-links">
          {!isLoggedIn ? (
            // If not logged in, show Register and Login links
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            // If logged in, show Profile and Logout links
            <>
              <Link to="/profile" className="profile-link" title="Profile">
                <span role="img" aria-label="Profile" style={{ fontSize: "1.3rem" }}>👤</span>
                {" "}Your Reviews
              </Link>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

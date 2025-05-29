import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import { AlbumDetails } from "./components/AlbumDetails";

function App() {
  return (
    <Router>
      <nav className="main-nav">
        <div className="nav-title">
          <Link to="/" className="tuned-title">Tuned</Link>
        </div>
        <div className="nav-links">
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <Link to="/profile" className="profile-link" title="Profile">
            <span role="img" aria-label="Profile" style={{ fontSize: "1.3rem" }}>👤</span>
          </Link>
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

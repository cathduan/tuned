import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ArtistInfo from './components/ArtistInfo';
import Profile  from './components/Profile';
import { AlbumDetails } from "./components/AlbumDetails";

//import ArtistInfo from './components/ArtistInfo'; <ArtistInfo>

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/register">Register</Link> | <Link to="/login">Login</Link> | <Link to="/profile">Profile </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search-albums" element={<ArtistInfo />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/album/:id" element={<AlbumDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

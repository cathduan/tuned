/**
 * @file Register.jsx
 * @description Allows a new user to register, then automatically logs them in and navigates to the homepage.
 * Handles form input, API communication, and login persistence using context and localStorage.
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import "./AuthProfileBox.css";

/**
 * Register Component
 * 
 * Renders a registration form. On success:
 *  - Sends user credentials to the backend
 *  - Automatically logs in the user
 *  - Stores token and userId in localStorage
 *  - Redirects to home page
 * Displays errors if registration or login fails.
 */
function Register() {
  // Local state for form fields and user feedback
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle form submission and user registration
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Register the user
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // If registration succeeded, log in the user immediately
        const loginRes = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userId', loginData.userId);
          login(); // Trigger login context
          navigate('/'); // Redirect to homepage
        } else {
          setMessage(loginData.message || 'Login after register failed.');
        }
      } else {
        setMessage(data.message); // Display registration error
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="centered-box-container">
      <div className="centered-box">
        <h2>Don't have an account? :O</h2>
        <h3>Make one!</h3>

        {/* Registration Form */}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register</button>
        </form>

        {/* Message display for feedback */}
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Register;

/**
 * @file Login.js
 * @description Login page for Tuned. Authenticates users using their username and password.
 * If credentials are valid, a JWT token is stored in localStorage and the user is redirected to home.
 * @authors Cathy, Charlie
 * @date 6/9/25
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AuthProfileBox.css";
import { AuthContext } from './AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // To update global login status

  /**
   * Handles when login button is clicked/form is submitted. Sends request to backend, 
   * stores token if successful, and redirects to the homepage.
   * @param {Event} e - Login button click /form submission
  */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Save JWT token
        localStorage.setItem('userId', data.userId) // Save user id 
        setMessage('Login successful!');
        navigate('/'); 
        login(); // Update AuthContext
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="centered-box-container">
      <div className="centered-box">
        <h2>It's you again! :) </h2>
        <form onSubmit={handleLogin}>
          <input
            type="username"
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
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Login;

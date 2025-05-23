import { useState } from 'react';
import "./AuthProfileBox.css";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! You can now login.');
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
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
        <input type="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
        </div>
      </div>
      
  );
}

export default Register;

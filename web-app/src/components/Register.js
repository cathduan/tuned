import { useState } from 'react';
import "./AuthProfileBox.css";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);


  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const res = await fetch('http://localhost:3001/register', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password }),
  //     });

  //   const data = await res.json();
  //   if (res.ok) {
  //     localStorage.setItem('token', data.token);
  //     localStorage.setItem('userId', data.userId);
  //     login();
  //     navigate('/');
  //   } else {
  //     setMessage(data.message);
  //   }
  //   } catch (err) {
  //     setMessage('Error connecting to server.');
  //   }
  // };

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
        const loginRes = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        const loginData = await loginRes.json();
        if (loginRes.ok) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userId', loginData.userId);
          login(); 
          navigate('/');
        } else {
          setMessage(loginData.message || 'Login after register failed.');
        }
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
          <h2>Don't have an account? :O</h2>
          <h3>Make one!</h3>
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

import React, { useState } from 'react';
import {jwtDecode} from 'jwt-decode';


function Home() {
    const token = localStorage.getItem('token');

    let username = '';

    if (token) {
        try {
        const decoded = jwtDecode(token);
        username = decoded.username;
        } catch (err) {
        console.error('Invalid token:', err);
        }
    }

    return (
      <div>
        <h2>{username}</h2>
        <button type="edit profile">Edit Profile</button>
        {token ? (
          <p> Favorite Album:</p>
        ) : (
          <p>You are not logged in.</p>
        )}
      </div>
    );
  }
  
  export default Home;
  
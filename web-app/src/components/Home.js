import React, { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { SearchBar } from "./SearchBar";
import { ResultsList } from "./ResultsList";


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

    const [results, setResults] = useState([]); 

    return (
      <div>
        <h2>Tuned</h2>
        {token ? (
          <p>Welcome to Tuned, {username}! You are logged in!</p>
        ) : (
          <p>You are not logged in.</p>
        )}
        <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            {results && results.length > 0 && <ResultsList results={results} />}
        </div>
      </div>
    );
  }
  
  export default Home;
  
import { useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { SearchBar } from "./SearchBar";
import { ResultsList } from "./ResultsList";
import "./Home.css";

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
        {token ? (
          <div className='welcome'>
          <p>Welcome to Tuned, {username}! You are logged in!</p>
          </div>
        ) : (
          <div className='welcome'>
          <p>You are not logged in.</p>
          </div>
        )}
        <div className="search-bar-container">
            <SearchBar setResults={setResults} />
            {results && results.length > 0 && <ResultsList results={results} />}
        </div>
      </div>
    );
  }
  
  export default Home;
  
/**
 * @file Home.js
 * @description Homepage for Tuned that displays a message depending on login status.
 * Uses the SearchBar and ResulstsList components to let users search and see search results.
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */
import { useState, useEffect, useContext } from 'react';
import {jwtDecode} from 'jwt-decode';
import { SearchBar } from "./SearchBar";
import { ResultsList } from "./ResultsList";
import { useLocation } from "react-router-dom";
import "./Home.css";

function Home() {
    const token = localStorage.getItem('token');
    const location = useLocation(); // Used to get prior search input

    let username = '';

    if (token) { // If token exists, decode to extract username
        try {
        const decoded = jwtDecode(token);
        username = decoded.username;
        } catch (err) {
        console.error('Invalid token:', err);
        }
    }

    const [input, setInput] = useState("");
    const [searchType, setSearchType] = useState("album"); // Tracks search by artist or album title
    const [results, setResults] = useState([]);

    // Restores previous search state if returning from another page 
    useEffect(() => {
        if (location.state?.input !== undefined) setInput(location.state.input);
        if (location.state?.searchType !== undefined) setSearchType(location.state.searchType);
        if (location.state?.results !== undefined) setResults(location.state.results);
    }, [location.state]);

    return (
      <div>
        {token ? (
          <div className='welcome'>
          <p>Welcome to Tuned, {username}! You are logged in!</p>
          <p>Search for an album to rate it.</p>
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

import React from "react";
import "./ResultsList.css";


export const ResultsList = ({ results }) => {
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>
          {result.title} by {result.artist} ({result.firstReleaseDate}, id: {result.id})
        </li>
      ))}
    </ul>
  );
};


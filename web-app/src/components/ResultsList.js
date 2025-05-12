import React from "react";
import "./ResultsList.css";

export const ResultsList = ({ results }) => {
  return (
    <ul>
      {results.map((album) => (
        <li key={album.id}>
          <strong>{album.title}</strong> by {album.artist} ({album.firstReleaseDate})
        </li>
      ))}
    </ul>
  );
};

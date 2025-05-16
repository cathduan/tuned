import React from "react";
import "./ResultsList.css";
import { Link } from "react-router-dom";

export const ResultsList = ({ results }) => {
  return (
    <ul>
     {results.map((album) => (
        <li key={album.id}>
          <Link to={`/album/${album.id}`}>
            <strong>{album.title}</strong> by {album.artist} ({album.firstReleaseDate})
          </Link>
        </li>
      ))}
    </ul>
  );
};

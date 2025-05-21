import React from "react";
import "./ResultsList.css";

const getCoverArtUrl = (releaseId) =>
  `https://coverartarchive.org/release/${releaseId}/front-250`;

const PLACEHOLDER_URL = "https://via.placeholder.com/64?text=No+Art";

export const ResultsList = ({ results }) => {
  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id}>
          <img
            src={getCoverArtUrl(result.id)}
            alt={`No Cover art `}
            style={{ width: 64, height: 64, objectFit: "cover", marginRight: 8 }}
            onError={(e) => {
              if (e.target.src !== PLACEHOLDER_URL) {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_URL;
              }
            }}
          />
          <span>
            {result.title} by {result.artist} (released: {result.firstReleaseDate})
          </span>
        </li>
      ))}
    </ul>
  );
};


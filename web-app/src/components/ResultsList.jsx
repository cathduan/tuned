import "./ResultsList.css";
import { Link } from "react-router-dom";

const getCoverArtUrl = (releaseId) =>
  `https://coverartarchive.org/release/${releaseId}/front-250`;

const PLACEHOLDER_IMG = "/album_notfound.png"

export const ResultsList = ({ results }) => {
  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id}>
          <img
            src={getCoverArtUrl(result.id)}
            alt={`Cover art for ${result.title}`}
            style={{ width: 64, height: 64, objectFit: "cover", marginRight: 8 }}
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMG;
                e.target.dataset.fallback = "true";
              }
            }}
          />
          <div className="result-info">
            <Link to={`/album/${result.id}`} className="result-title">
              {result.title}
            </Link>
            <div className="result-artist">{result.artist}</div>
            <div className="result-date">Released: {result.firstReleaseDate}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};


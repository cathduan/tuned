/**
 * @file ResultsList.jsx
 * @description Renders a list of album search results, including cover art, title (linked),
 * artist name, and release date.
 * @author 
 *   - Charlie Ney
 *   - Cathy Duan
 * @date 6/8/25
 */

import "./ResultsList.css";
import { Link } from "react-router-dom";

// Utility: Generate the cover art URL from the Cover Art Archive
const getCoverArtUrl = (releaseId) =>
  `https://coverartarchive.org/release/${releaseId}/front-250`;

// Placeholder image for missing cover art
const PLACEHOLDER_IMG = "/album_notfound.png";

/**
 * Component: ResultsList
 * @param {Array} results - List of album search result objects
 * 
 * For each result, display:
 *   - Cover art (with fallback)
 *   - Title as a link to album detail page
 *   - Artist name
 *   - Release year
 */
export const ResultsList = ({ results }) => {
  return (
    <ul className="results-list">
      {results.map((result) => (
        <li key={result.id}>
          {/* Album cover image, fallback to placeholder if not found */}
          <img
            src={getCoverArtUrl(result.id)}
            alt={`Cover art for ${result.title}`}
            style={{
              width: 64,
              height: 64,
              objectFit: "cover",
              marginRight: 8,
            }}
            onError={(e) => {
              // Only fallback once to prevent infinite loop
              if (!e.target.dataset.fallback) {
                e.target.onerror = null;
                e.target.src = PLACEHOLDER_IMG;
                e.target.dataset.fallback = "true";
              }
            }}
          />

          {/* Album info: title (as link), artist, and release date */}
          <div className="result-info">
            <Link to={`/album/${result.id}`} className="result-title">
              {result.title}
            </Link>
            <div className="result-artist">{result.artist}</div>
            <div className="result-date">
              Released: {result.firstReleaseDate}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

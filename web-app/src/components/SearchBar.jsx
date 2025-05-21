import { useState } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    if (!value) return;

    try {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
          value
        )}&fmt=json&limit=20`
      );
      const data = await response.json();

      // Filter releases to only include those of type 'Album' or 'EP'
      const results = data.releases
        ?.filter(
          (release) =>
            release["release-group"] &&
            ["Album", "EP"].includes(release["release-group"]["primary-type"])
        )
        .map((release) => ({
          id: release.id,
          title: release.title,
          artist: release["artist-credit"]
            ?.map((artist) => artist.name)
            .join(", ") || "Unknown Artist",
          firstReleaseDate: release.date || "Unknown Date",
          type: release["release-group"]?.["primary-type"] || "Unknown",
        }));

      setResults(results || []);
    } catch (error) {
      console.error("Error fetching data from MusicBrainz:", error);
      setResults([]);
    }
  };

  const handleSearch = (value) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className="searchbar-center">
      <div className="input-wrapper">
        <input
          placeholder="Type to search for an album title..."
          value={input}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
};
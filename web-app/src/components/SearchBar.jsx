import { useState } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");

  const fetchData = async (value) => {
    if (!value) return;

    try {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/release-group/?query=${encodeURIComponent(
          value
        )}&type=album&fmt=json`
      );
      const data = await response.json();

      const results = data["release-groups"]?.map((release) => ({
        id: release.id,
        title: release.title,
        artist: release["artist-credit"]
          ?.map((artist) => artist.name)
          .join(", "),
        firstReleaseDate: release["first-release-date"]
      }));

//        const response = await fetch(
//         `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
//           value
//         )}&type=album&fmt=json`
//       );
//       const data = await response.json();

//       const results = data["release"]?.map((release) => ({
//         id: release.id,
//         title: release.title,
//         artist: release["artist-credit"]
//           ?.map((artist) => artist.name)
//           .join(", "),
//         firstReleaseDate: release["first-release-date"]
//       }));

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
    <div className="input-wrapper">
      <input
        placeholder="Type to search for an album title..."
        value={input}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

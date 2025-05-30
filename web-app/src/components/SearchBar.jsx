import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("album"); // "album" or "artist"
  const abortControllerRef = useRef(null);

  // Debounce input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (input.trim() !== searchTerm) {
        setSearchTerm(input.trim());
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [input, searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      try {
        let url;
        if (searchType === "album") {
          url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
            searchTerm
          )}&fmt=json&limit=100`;
        } else {
          // Quote the artist name for multi-word searches
          url = `https://musicbrainz.org/ws/2/release/?query=artist:"${encodeURIComponent(
            searchTerm
          )}"&fmt=json&limit=200`;
        }

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const results = data.releases
          ?.filter(
            (release) =>
              release["release-group"] &&
              ["Album", "EP"].includes(release["release-group"]["primary-type"])
          )
          .map((release) => ({
            id: release.id,
            title: release.title,
            artist:
              release["artist-credit"]
                ?.map((artist) => artist.name)
                .join(", ") || "Unknown Artist",
            firstReleaseDate: release.date || "Unknown Date",
            type: release["release-group"]?.["primary-type"] || "Unknown",
          }));

        setResults(results || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching data from MusicBrainz:", error);
          setResults([]);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, [searchTerm, setResults, searchType]);

  return (
    <div className="searchbar-center">
      <div className="input-wrapper">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{
            marginRight: 10,
            borderRadius: 12,
            border: "1px solid #b8c0ff",
            background: "#f6e3f5",
            fontSize: "1rem",
          }}
        >
          <option value="album">Album Title</option>
          <option value="artist">Artist</option>
        </select>
        <input
          placeholder={
            searchType === "album"
              ? "Type to search for an album title..."
              : "Type to search for an artist..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};
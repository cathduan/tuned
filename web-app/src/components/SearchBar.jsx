import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const abortControllerRef = useRef(null);

  // Debounce input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      if (input.trim() !== searchTerm) {
        setSearchTerm(input.trim());
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(handler);
  }, [input, searchTerm]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    // Cancel previous fetch if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
            searchTerm
          )}&fmt=json&limit=20`,
          { signal: controller.signal }
        );
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

    // Cleanup: abort fetch on unmount or input change
    return () => controller.abort();
  }, [searchTerm, setResults]);

  return (
    <div className="searchbar-center">
      <div className="input-wrapper">
        <input
          placeholder="Type to search for an album title..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
    </div>
  );
};
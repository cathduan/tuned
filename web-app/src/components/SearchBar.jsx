import { useState, useEffect, useRef } from "react";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("album");
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
        let results = [];

        if (searchType === "album") {
          const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(
            searchTerm
          )}&fmt=json&limit=100`;

          const response = await fetch(url, { signal: controller.signal });
          const data = await response.json();

          const rawResults =
            data.releases
              ?.filter(
                (release) =>
                  release["release-group"] &&
                  ["Album", "EP"].includes(
                    release["release-group"]["primary-type"]
                  )
              )
              .map((release) => ({
                id: release.id,
                title: release.title,
                artist:
                  release["artist-credit"]
                    ?.map((artist) => artist.name)
                    .join(", ") || "Unknown Artist",
                firstReleaseDate: release.date || "Unknown Date",
                type:
                  release["release-group"]?.["primary-type"] || "Unknown",
              })) || [];

          const seen = new Set();
          results = rawResults.filter((item) => {
            const key = `${item.title.toLowerCase()}|${item.artist.toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        } else {
          // Step 1: Search for the artist by name
          const artistRes = await fetch(
            `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(
              searchTerm
            )}&fmt=json&limit=10`,
            { signal: controller.signal }
          );
          const artistData = await artistRes.json();

          let artist = null;
          if (artistData.artists && artistData.artists.length > 0) {
            artist =
              artistData.artists.find((a) =>
                a.name.toLowerCase().includes(searchTerm.toLowerCase())
              ) || artistData.artists[0];
          }
          if (!artist) {
            setResults([]);
            return;
          }

          // Step 2: Get albums/EPs from release-groups
          const groupRes = await fetch(
            `https://musicbrainz.org/ws/2/release-group?artist=${artist.id}&type=album|ep&fmt=json&limit=100`,
            { signal: controller.signal }
          );
          const groupData = await groupRes.json();

          const rawResults =
            groupData["release-groups"]?.map((group) => ({
              id: group.id,
              title: group.title,
              artist: artist.name,
              firstReleaseDate: group["first-release-date"] || "Unknown Date",
              type: group["primary-type"] || "Unknown",
            })) || [];

          const seen = new Set();
          results = rawResults.filter((item) => {
            const key = `${item.title.toLowerCase()}|${item.artist.toLowerCase()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }

        setResults(results);
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
            borderRadius: 8,
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

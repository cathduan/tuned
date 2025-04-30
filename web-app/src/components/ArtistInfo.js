import React, { useEffect, useState } from 'react';

function ArtistInfo() {
  const [artist, setArtist] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);

  // Fetch artist info when the page loads
  useEffect(() => {
    fetch('http://127.0.0.1:3001/')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched artist:', data);
        setArtist(data);
      })
      .catch((err) => console.error('Error fetching artist:', err));
  }, []);

  // Function to handle album search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    setLoadingAlbums(true);
    try {
      const res = await fetch(`http://127.0.0.1:3001/search-albums?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      console.log('Fetched albums:', data);
      setAlbums(data.releases || []);
    } catch (err) {
      console.error('Error fetching albums:', err);
    } finally {
      setLoadingAlbums(false);
    }
  };

  if (!artist) return <p>Loading artist info...</p>;

  return (
    <div>
      <h1>Name: {artist.name}</h1>
      <p>ID: {artist.id}</p>
      <p>Type: {artist.type}</p>

      <hr />

      <h2>Search Albums</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for an album..."
        />
        <button type="submit">Search</button>
      </form>

      {loadingAlbums && <p>Loading albums...</p>}

      {albums.length > 0 && (
        <ul>
          {albums.map((album) => (
            <li key={album.id}>
              <strong>{album.title}</strong> ({album['date'] || 'Unknown year'})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ArtistInfo;

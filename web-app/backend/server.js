const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

async function searchAlbums(query) {
  try {
    const { MusicBrainzApi } = await import('musicbrainz-api');

    const config = {
      baseUrl: 'https://musicbrainz.org',
      appName: 'Tuned',
      appVersion: '0.1.0',
      appContactInfo: 'charlieney@gmail.com',
    };

    const mbApi = new MusicBrainzApi(config);
    const albums = await mbApi.search('release', { release: query });
    return albums;
  } catch (err) {
    console.error('Error searching albums:', err);
    return null;
  }
}

const hostname = '127.0.0.1';
const port = 3001;

// New route to search albums
app.get("/search-albums", async (req, res) => {
  const query = req.query.q; // example: /search-albums?q=Abbey+Road
  if (!query) {
    res.status(400).json({ error: "Missing 'q' query parameter" });
    return;
  }

  const albums = await searchAlbums(query);
  res.status(200).json(albums);
});

// Existing route
app.get("/", async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: "Welcome to Tuned API!" }));
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

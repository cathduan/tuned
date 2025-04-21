const { createServer } = require('node:http');
const { getArtistInfo } = require('./musicbrainz');

const hostname = '127.0.0.1';
const port = 3000;

const server = createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');


  const artist = await getArtistInfo();
  res.end(JSON.stringify(artist));


});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// app.get("/profiles")

//import {createServer} from 'http';
//import Client from 'pg';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import pg from 'pg';
import { MusicBrainzApi } from 'musicbrainz-api';

dotenv.config();

const hostname = '127.0.0.1';
const port = 3001;
const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(cors());

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
})

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test server for Tuned is running'); 

});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM profiles WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO profiles (username, password_hash) VALUES ($1, $2) RETURNING *',
      [username, password_hash]
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).send('Server error');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM profiles WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username' });
    }
    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userId: user.id });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
});

app.post('/reviews', async (req, res) => {
  console.log('Request body:', req.body);  
  const { userId, albumId, rating, notes, dateListened } = req.body;

  try {
      const result = await pool.query(
          `INSERT INTO reviews (user_id, album_id, rating, notes, date_listened)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [userId, albumId, rating, notes, dateListened]
      );

      res.status(201).json(result.rows[0]);
  } catch (err) {
      console.error('Error saving review:', err);
      res.status(500).json({ error: 'Failed to save review' });
  }
});


app.get('/profiles', async (req, res) => { 
  try {
      const result = await pool.query("SELECT * FROM profiles");
      res.json(result.rows); 
  } catch (err) {
      console.error("Error fetching courses:", err.message);
      res.status(500).send("Server Error");
  }
});

app.get('/reviews', async (req, res) => { 
  try {
      const result = await pool.query("SELECT * FROM reviews");
      res.json(result.rows); 
  } catch (err) {
      console.error("Error fetching reviews:", err.message);
      res.status(500).send("Server Error");
  }
});

app.get("/profiles/:id/reviews", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT reviews.*, profiles.username
       FROM reviews
       JOIN profiles ON reviews.user_id = profiles.id
       WHERE user_id = $1
       ORDER BY date_listened DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching user reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

app.get("/search-albums", async (req, res) => {
  const query = req.query.q; // example: /search-albums?q=Abbey+Road
  if (!query) {
    res.status(400).json({ error: "Missing 'q' query parameter" });
    return;
  }

  const albums = await searchAlbums(query);
  res.status(200).json(albums);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// Existing route
// app.get("/", async (req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'application/json');
//   res.end(JSON.stringify({ message: "Welcome to Tuned API!" }));
// });

// app.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

export default app;
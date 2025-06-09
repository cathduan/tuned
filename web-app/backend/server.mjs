/**
 * @file server.mjs
 * @description Main server file for Tuned. Handles register/login (profile creation and userauthentication); 
 * creating, retrieving, editing, and deleting user reviews; and searching via the MusicBrainz API.
 * Uses Express, psql, bcrypt, JWT, dotenv, and MusicBrainz.
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config(); // Get variables .env file

// Initialize app
const port = 3001;
const app = express();
const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

app.use(cors());

// Connect to psql using dotenv variables
const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME
})

app.use(express.json());

/**
 * @route GET /
 * @desc Basic root route to verify that the server is running.
 */
app.get('/', (req, res) => {
  res.send('Test server for Tuned is running'); 

});

/**
 * @route POST /register
 * @desc Register a new user with a hashed password (using bcrypt and salting).
 */
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

/**
 * @route POST /login
 * @desc Authenticate a user and return a JWT token.
 */
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

/**
 * @route POST /reviews
 * @desc Create a new review for an album and associate it with that user id.
 */
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

/**
 * @route GET /profiles
 * @desc Fetch all user profiles.
 */
app.get('/profiles', async (req, res) => { 
  try {
      const result = await pool.query("SELECT * FROM profiles");
      res.json(result.rows); 
  } catch (err) {
      console.error("Error fetching courses:", err.message);
      res.status(500).send("Server Error");
  }
});

/**
 * @route GET /reviews
 * @desc Fetch all reviews.
 */
app.get('/reviews', async (req, res) => { 
  try {
      const result = await pool.query("SELECT * FROM reviews");
      res.json(result.rows); 
  } catch (err) {
      console.error("Error fetching reviews:", err.message);
      res.status(500).send("Server Error");
  }
});

/**
 * @route GET /profiles/:id/reviews
 * @desc Get all reviews made by a specific user.
 */
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

/**
 * @route DELETE /reviews/:id
 * @desc Delete a review by its id.
 */
app.delete('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [reviewId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

/**
 * @route PUT /reviews/:id
 * @desc Update an existing review that the user made.
 */
app.put('/reviews/:id', async (req, res) => {
  const reviewId = req.params.id;
  const { rating, notes, date_listened } = req.body;
  try {
    const result = await pool.query(
      `UPDATE reviews
       SET rating = $1, notes = $2, date_listened = $3
       WHERE id = $4
       RETURNING *`,
      [rating, notes, date_listened, reviewId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


export default app;
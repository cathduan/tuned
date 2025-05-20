-- remember to create a database
CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES profiles(id),
    album_id TEXT NOT NULL,
    rating INTEGER,
    notes TEXT,
    date_listened DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
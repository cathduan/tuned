-- remember to create a database
CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    username VARCHAR(28) NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL
);

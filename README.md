# tuned

**Description of Project:** 
Our project *Tuned* is a web-app that allows users to search, log, and rate albums that they have been listening to and, in addition, track what their friends have been listening to (in the future).

**Features:**

Currently, we’re able to have a simple search of albums by album title, and by artist. However, there are some bugs with our search and we have  no way to narrow down the search if the album title happens to be very popular. 

We also have a simple registration and login system that uses bcrypt to encrypt passwords. 

For our reviews, we have a 5 star rating currently with a text field for notes and also a date field. These reviews are displayed on a user’s profile, but users currently cannot edit or delete these reviews. We want to expand on our reviews so that the web-page is more interesting: adding half star reviews, potentially listing out the album’s songs and having the user choose their favorite songs of the albums, etc.

**TODO**
We plan to create a friend-adding system that would involve friend requests (finding a user profile and making a friend request, accepting the request, and declining the request). When friends with someone, users can see their friend’s reviews. We also would like to create a logout button. 

We also hope to further improve the search, so that we can somehow sort our results better, and fix various bugs. Right now, our search by artist only works if the artist's name is fully typed out.

**Getting Started:** 

1. In your code editor, clone the repository. Make sure to have npm, node, and postgres installed. We have one node module folder in web-app (NOT in backend), so make sure to run `npm install` in ONLY the web-app directory.

2. In the backend: create a psql database named “tuned”. Then, run the following line to create a table necessary for our account system: 
    `psql -U <your username> -d tuned < account.sql`

3. Also in the backend folder, change the .env file to reflect your machine's username and password.
3. `cd backend`
4. `node server.mjs`
5. Open a second terminal
6. `cd web-app`
7. `npm start`

# tuned

**Description of Project:** 

Our project *Tuned* is a web-app that allows users to search, log, and rate albums that they have been listening to and, in addition, track what their friends have been listening to (in the future).

**Existing Features:**

We have a user authentication system that allows users to register, login, and logout. Users create accounts with usernames that are displayed around the web-app once logged in and with passwords that are encrypted through salting. 

When logged in, users are able to search through albums by typing out an album title or an artist. Search results show the album’s art (if available) and various pieces of metadata. Users are able to click on albums, which brings them to a new page that shows more information and review fields.

For our reviews, we have a 5 star rating system, a text field for notes, and also a date field. These reviews are displayed on a user’s profile and can be edited or deleted. Additional metadata of a reviewed album can be seen when clicking on the underlined name of the album. 

**Features we did not create:**

We planned on creating a friend-adding system that would involve friend requests (finding a user profile and making a friend request, accepting the request, and declining the request). When friends with someone, users would have been able to see their friend’s reviews.

We also hoped to further improve the search, so that we can somehow sort our results better, and fix various bugs. Right now, our search by artist only works if the artist's name is fully typed out. 

We also hoped to return to the previous search when hitting the back button on the AlbumDetails.js page. However, the code does not work, but we left it in there since we might return to it (and it doesn’t destroy our web-app). 

**Getting Started:** 

1. In your code editor, clone the repository. Make sure to have npm, node, and postgres installed. We have one node module folder in web-app (NOT in backend), so make sure to run `npm install` in ONLY the web-app directory.

2. In the backend: create a psql database named “tuned”. Then, run the following line to create a table necessary for our account system: 
    `psql -U <your username> -d tuned < account.sql`

3. Also in the backend folder, change the .env file to reflect your machine's username and password.

4. `cd backend`
5. `node server.mjs`
6. Open a second terminal
7. `cd web-app`
8. `npm start`

Please refer to our development.txt and running.txt within the "docs" folder for more guidance on how to run our app. 


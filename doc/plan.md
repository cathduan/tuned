## Description

A website that allows users to log and rate albums and subsequently track what albums their friends have been listening to.

## Learning Goals

* Clean data and fetch from a database to populate a web page  
* Lean how to store user data and save profiles   
* Create a robust search for albums, songs, artists, users  
* Learn how to connect different users as "friends"  
* Create a strong, interactive UI   
* Gain a strong understanding of how the architecture works and the tools for each side  
* Setting up a server

## Feature Goals:

### Essential

- Ability to rate albums/songs (star/numeric rating with other metadata like the date of the log, author of the log) and edit these logs  
- Connect with friends and see what they have rated via an “activity” feed  
- A professional UI  
- Hub that lists the albums and a search that allows people to narrow down the listings

### Nice-to-have

- Shelves (lists of albums/songs that can be titled and personalized)   
- Tags  
- Ability to write reviews  
- Account customization (profile data and also a profile page that displays their ratings and thoughts)   
- User authentication

### Stretch

Constantly updating database of songs  
Setting up a server via AWS to make this useable beyond our local machines

## Architecture

- Database: PostgreSQL for our music database  
- Backend: Node JS and Python   
- Frontend: React, CSS, and other libraries that we see fit 

## Schedule

1. Get dataset of music and design our concept pages  
2. Setup database to store users and music  
3. Make a way to visualize albums/music  
4. Make a way to navigate through the data: Album search/Recently released albums page(s)  
5. Implement album rating/reviewing feature  
6. Setup basic user authentication and user profile concept or page  
7. Friend system (Could do this at any point before activity feed)  
8. Create an activity feed that is updatable   
9. Polish/Bug fixing  
10. Setup server

## Worries

Neither of us have experience with connecting different users together asynchronously, so building a website that does that will be challenging. In a broader sense, we want to ensure to push ourselves on this project, and produce something we are genuinely proud of. We are worried that if we aren’t careful we won’t push ourselves enough to make something we are happy with

## Communications

We will use a combination of texting and calling, with in person meetings where we can pair-program.

## Team-work

We only have two students in our group, so while we understand that it will be impossible to perfectly split up the work, we hope to use consistent meetings and communication to make sure that both of us are involved. Additionally, after meetings we will set up concrete deliverables to have for the next time we meet, which will help us set expectations for each other.  

# GameBoxd: A Social Platform for Gamers

GameBoxd is an innovative web application designed to connect video game enthusiasts, enabling them to rate, review, and catalog their favorite games. The platform fosters a vibrant community where gamers can share their experiences, discover new games, and engage with others who share their interests.

## Release Notes:
### New Features:

- **Game Cataloging:** Users can create personalized game libraries to track the games they own or want to play.
- **Ratings & Reviews:** Share detailed game reviews and ratings to guide others in the community.
- **Social Interaction:** Connect with like-minded gamers, follow their profiles, and engage through comments and discussions.
- **Game Discovery:** Discover trending games, new releases, and hidden gems through community-curated lists and recommendations.
- **Search & Filters:** Quickly find players by name


### Bug Fixes:
- Fixed an issue where reviews would not save properly for certain users.
- Resolved a display bug in the search results for mobile users.
- Addressed performance issues with large game libraries causing slow page loads.

## Project Structure:
- **server**: Contains the backend code powered by Node.js with an Express.js framework for handling API requests.
- **client**: Contains the frontend code built using React for a responsive user interface.

## Install Guide:
### Prerequisites:
Before running the application, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)

### Dependent Libraries:
The following third-party libraries are required and will be installed automatically:

#### Backend:
- Express.js
- MongoDB (optional: Atlas or local installation)
#### Frontend:
- React
- Axios

### Download Instructions:
Clone the GitHub repository (`git clone [repository_url]`).

### Running the Application:

#### Backend (Server):

1. `cd server`
2. Run `node server.js`

#### Frontend (Client):

1. `cd client`
2. Run `npm start`

#### Access the application in your web browser at http://localhost:3000.

### Deployment:

- Host the backend using platforms like Heroku or AWS, ensuring proper configuration of environment variables
- Deploy the frontend to static hosting services like Netlify or Vercel.
- Update the API base URL in the frontend to point to the deployed backend.

### Troubleshooting:
- Port already in use error
  - Ensure no other applications are using the same port or modify the port number in the backend configuration. 
- Database connection error
  - Verify MongoDB is running and the connection string is correct in .env. 
- Frontend not loading
  - Ensure the React server is running without errors in the terminal.

## Contributing:
1. Create a feature branch (`git checkout -b feature-branch`).
2. Commit your changes (`git commit -m 'Added [feature]'`).
3. Push to the branch (`git push origin feature-branch`).
4. Create a pull request (on GitHub itself).

## License:
This project is licensed under the MIT License - see the LICENSE file for details.

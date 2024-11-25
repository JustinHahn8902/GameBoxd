// /scripts/loadIGDBData.js
const axios = require('axios');
const mongoose = require('mongoose');
const Game = require('../models/Game'); // Your Mongoose model

require('dotenv').config(); // Load environment variables from .env file

const MONGO_URI = process.env.MONGO_URI; // Your MongoDB connection string
const clientId = process.env.TWITCH_CLIENT_ID; // Your Twitch Client ID
const clientSecret = process.env.TWITCH_CLIENT_SECRET; // Your Twitch Client Secret

// Function to get OAuth token
async function getOAuthToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting OAuth token:', error);
    }
}

// Function to fetch data from IGDB with pagination
async function fetchIGDBData(accessToken, offset = 0, limit = 500) {
    try {
        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields name, genres, first_release_date, summary, cover.url; limit ${limit}; offset ${offset}; where first_release_date != null;`,
            {
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching IGDB data:', error);
        return [];
    }
}

// Function to load data into MongoDB
async function loadIGDBDataIntoMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const accessToken = await getOAuthToken();
        let offset = 0;
        const limit = 500;
        let hasMoreData = true;

        while (hasMoreData) {
            const gameData = await fetchIGDBData(accessToken, offset, limit);
            if (gameData.length === 0) {
                hasMoreData = false;
                break;
            }

            await Promise.all(
                gameData.map(async (game) => {
                    const releaseDate = game.first_release_date ? new Date(game.first_release_date * 1000) : null;

                    if (!releaseDate || isNaN(releaseDate.getTime())) {
                        console.warn(`Invalid release date for game: ${game.name}`);
                        return;
                    }

                    const newGame = new Game({
                        name: game.name,
                        genres: game.genres,
                        release_date: releaseDate,
                        summary: game.summary,
                        cover_url: game.cover ? game.cover.url : null
                    });

                    try {
                        await newGame.save();
                        console.log(`Saved game: ${game.name}`);
                    } catch (error) {
                        console.error(`Error saving game: ${game.name}`, error);
                    }
                })
            );

            offset += limit; // Move to the next set of games
        }

    } catch (error) {
        console.error('Error loading IGDB data:', error);
    } finally {
        mongoose.connection.close();
    }
}

loadIGDBDataIntoMongoDB();

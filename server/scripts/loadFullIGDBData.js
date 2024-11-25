const axios = require('axios');
const mongoose = require('mongoose');
const Game = require('../models/Game');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));
// Get OAuth Token
async function getOAuthToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting OAuth token:', error.response?.data || error.message);
        throw error;
    }
}
// Fetch from an individual endpoint
async function fetchFromEndpoint(token, endpoint, ids, fields) {
    if (ids.length === 0) return [];
    const headers = {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
    const body = `fields ${fields}; where id = (${ids.join(',')});`;
    try {
        const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, body, { headers });
        // Transform relative URLs to full URLs
        if (fields.includes('url')) {
            return response.data.map((item) => ({
                ...item,
                url: item.url ? `https:${item.url}` : null, // Ensure full URL
            }));
        }
        return response.data;
    } catch (error) {
        console.error(`Error fetching from ${endpoint}:`, error.response?.data || error.message);
        return [];
    }
}
// Fetch Games
async function fetchGames(token, limit = 10, offset = 0) {
    const headers = {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
    };
    const gamesQuery = `
        fields id, name, first_release_date, genres, cover, screenshots, similar_games, 
            total_rating, total_rating_count, summary, websites, platforms;
        where first_release_date != null & total_rating_count > 10;
        limit ${limit}; offset ${offset};
    `;
    try {
        const response = await axios.post('https://api.igdb.com/v4/games', gamesQuery, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error.response?.data || error.message);
        return [];
    }
}
async function fetchRelatedAttribute(token, field, ids, attribute) {
    if (!Array.isArray(ids) || ids.length === 0) return []; // Ensure valid array
    const headers = {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'text/plain',
    };
    const body = `fields ${attribute}; where id = (${ids.join(',')});`;
    try {
        const response = await axios.post(`https://api.igdb.com/v4/${field}`, body, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching from ${field}:`, error.response?.data || error.message);
        return [];
    }
}
// Fetch and Save IGDB Data
async function fetchAndSaveIGDBData() {
    try {
        const token = await getOAuthToken();
        // Step 1: Fetch Games
        const games = await fetchGames(token, 500, 1000); // Adjust limit and offset as needed
        console.log(`Fetched ${games.length} games`);
        // Step 2: Process each game
        for (const game of games) {
            console.log(`Processing Game: ${game.name}`);
            // Get cover URL
            const coverURL = game.cover
                ? await fetchRelatedAttribute(token, 'covers', [game.cover], 'url')
                : [];
        
            if (coverURL.length > 0) {
                coverURL[0].url = coverURL[0].url.replace(/^\/\//, 'https://').replace(/t_thumb/, 't_cover_big');
            }
        
            // Get genres
            const genres = game.genres && Array.isArray(game.genres)
                ? await fetchRelatedAttribute(token, 'genres', game.genres, 'name')
                : [];
        
            // Get screenshot URLs
            const screenshotURLs = game.screenshots && Array.isArray(game.screenshots)
                ? await fetchRelatedAttribute(token, 'screenshots', game.screenshots, 'url')
                : [];
        
            screenshotURLs.forEach((screenshot) => {
                if (screenshot.url) {
                    screenshot.url = screenshot.url.replace(/^\/\//, 'https://').replace(/t_thumb/, 't_original');
                }
            });
        
            // Get website URLs
            const websiteURLs = game.websites && Array.isArray(game.websites)
                ? await fetchRelatedAttribute(token, 'websites', game.websites, 'url')
                : [];
        
            websiteURLs.forEach((website) => {
                if (website.url) {
                    website.url = website.url.replace(/^\/\//, 'https://');
                }
            });
        
            // Get platforms
            const platforms = game.platforms && Array.isArray(game.platforms)
                ? await fetchRelatedAttribute(token, 'platforms', game.platforms, 'name')
                : [];
        
            const realGame = {
                igdb_id: game.id,
                name: game.name,
                release_date: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
                genres: genres.map((genre) => genre.name),
                cover_url: coverURL[0]?.url || null,
                screenshot_urls: screenshotURLs.map((screenshot) => screenshot.url),
                similar_games: game.similar_games,
                total_rating: game.total_rating,
                total_rating_count: game.total_rating_count,
                summary: game.summary,
                website_urls: websiteURLs.map((website) => website.url),
                platforms: platforms.map((platform) => platform.name),
            };
        
            await Game.create(realGame);
            console.log(`Saved Game: ${game.name}`);
        }
        console.log('All games saved to MongoDB!');
    } catch (error) {
        console.error('Error processing IGDB data:', error.message);
    } finally {
        mongoose.connection.close();
    }
}
fetchAndSaveIGDBData();
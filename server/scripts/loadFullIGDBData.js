const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const Game = require('../models/Game');

require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;

const FETCHED_FILE = 'fetched.txt';

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Get the last offset from fetched.txt
function getLastOffset() {
    if (fs.existsSync(FETCHED_FILE)) {
        const content = fs.readFileSync(FETCHED_FILE, 'utf8').trim();
        return parseInt(content, 10) || 0;
    }
    return 0;
}

// Save the new offset to fetched.txt
function saveOffset(offset) {
    fs.writeFileSync(FETCHED_FILE, offset.toString(), 'utf8');
}

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
    if (!Array.isArray(ids) || ids.length === 0) return [];

    const headers = {
        'Client-ID': clientId,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };

    const body = `fields ${fields}; where id = (${ids.join(',')});`;

    try {
        const response = await axios.post(`https://api.igdb.com/v4/${endpoint}`, body, { headers });
        return response.data.map((item) => ({
            ...item,
            url: item.url ? `https:${item.url}` : null, // Transform relative URLs
        }));
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

// Fetch and Save IGDB Data
async function fetchAndSaveIGDBData(userLimit) {
    let offset = getLastOffset(); // Start from the last saved offset
    const token = await getOAuthToken();
    const limit = userLimit;

    try {
        while (true) {
            console.log(`Fetching games with limit=${limit} and offset=${offset}...`);
            const games = await fetchGames(token, limit, offset);

            if (games.length === 0) {
                console.log('No more games to fetch.');
                break;
            }

            console.log(`Fetched ${games.length} games`);

            for (const game of games) {
                console.log(`Processing Game: ${game.name}`);

                // Fetch related data
                const coverURL = game.cover
                    ? await fetchFromEndpoint(token, 'covers', [game.cover], 'url')
                    : [];
                const genres = game.genres && Array.isArray(game.genres)
                    ? await fetchFromEndpoint(token, 'genres', game.genres, 'name')
                    : [];
                const screenshotURLs = game.screenshots && Array.isArray(game.screenshots)
                    ? await fetchFromEndpoint(token, 'screenshots', game.screenshots, 'url')
                    : [];
                const websiteURLs = game.websites && Array.isArray(game.websites)
                    ? await fetchFromEndpoint(token, 'websites', game.websites, 'url')
                    : [];
                const platforms = game.platforms && Array.isArray(game.platforms)
                    ? await fetchFromEndpoint(token, 'platforms', game.platforms, 'name')
                    : [];

                // Transform URLs with checks
                const coverUrlFinal = coverURL.length > 0 && coverURL[0]?.url
                    ? coverURL[0].url.replace(/t_thumb/, 't_cover_big')
                    : null;

                const screenshotUrlsFinal = screenshotURLs.map((s) =>
                    s.url ? s.url.replace(/t_thumb/, 't_original') : null
                ).filter(Boolean); // Remove null values

                const websiteUrlsFinal = websiteURLs.map((w) =>
                    w.url ? w.url.replace(/^\/\//, 'https://') : null
                ).filter(Boolean); // Remove null values

                const realGame = {
                    igdb_id: game.id,
                    name: game.name,
                    release_date: game.first_release_date ? new Date(game.first_release_date * 1000) : null,
                    genres: genres.map((g) => g.name),
                    cover_url: coverUrlFinal,
                    screenshot_urls: screenshotUrlsFinal,
                    similar_games: game.similar_games,
                    total_rating: game.total_rating,
                    total_rating_count: game.total_rating_count,
                    summary: game.summary,
                    website_urls: websiteUrlsFinal,
                    platforms: platforms.map((p) => p.name),
                };

                await Game.create(realGame);
                console.log(`Saved Game: ${game.name}`);
            }

            offset += limit; // Update offset
            saveOffset(offset); // Save new offset to file

            // Wait to respect rate limit
            await new Promise((resolve) => setTimeout(resolve, 1000 / 4)); // 4 requests per second
        }

        console.log('All games saved to MongoDB!');
    } catch (error) {
        console.error('Error processing IGDB data:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

// Start script with user input for limit
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the number of games to fetch at a time: ', (answer) => {
    const userLimit = parseInt(answer, 10);
    if (!isNaN(userLimit) && userLimit > 0) {
        fetchAndSaveIGDBData(userLimit);
    } else {
        console.error('Invalid input. Please enter a positive number.');
        mongoose.connection.close();
    }
    rl.close();
});

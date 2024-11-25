import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function GameDetailPage() {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/games/${id}`);
                setGame(response.data);
            } catch (error) {
                setError(error.response.data.error);
            } finally {
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="game-detail">
            <h1>{game.name || 'Unknown Game'}</h1>
            <img src={game.cover_url || 'placeholder-image-url'} alt={game.name} className="game-cover" />
            <p><strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Release Date:</strong> {game.release_date ? new Date(game.release_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Rating:</strong> {game.total_rating ? `${game.total_rating.toFixed(1)} (${game.total_rating_count} votes)` : 'N/A'}</p>
            <p><strong>Summary:</strong> {game.summary || 'No summary available.'}</p>
            <p><strong>Platforms:</strong> {game.platforms?.join(', ') || 'N/A'}</p>
            <div className="game-screenshots">
                <h2>Screenshots</h2>
                {game.screenshot_urls?.length ? (
                    game.screenshot_urls.map((url, index) => (
                        <img key={index} src={url} alt={`Screenshot ${index + 1}`} className="game-screenshot" />
                    ))
                ) : (
                    <p>No screenshots available.</p>
                )}
            </div>
            <div className="game-websites">
                <h2>Websites</h2>
                {game.website_urls?.length ? (
                    game.website_urls.map((url, index) => (
                        <p key={index}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></p>
                    ))
                ) : (
                    <p>No websites available.</p>
                )}
            </div>
            <div className="game-similar-games">
                <h2>Similar Games</h2>
                {game.similar_games?.length ? (
                    game.similar_games.map((similarGameId, index) => (
                        <p key={index}>Game ID: {similarGameId}</p>
                    ))
                ) : (
                    <p>No similar games available.</p>
                )}
            </div>
        </div>
    );
}

export default GameDetailPage;
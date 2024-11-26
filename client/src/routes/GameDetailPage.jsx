import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import StarRating from '../components/StarRating';
import { UserContext } from '../context/UserContext';

function GameDetailPage() {
    const { user } = useContext(UserContext);

    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [similarGames, setSimilarGames] = useState([]);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [reviewButtonText, setReviewButtonText] = useState("Submit");

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/games/${id}`);
                setGame(response.data);

                if (response.data.similar_games?.length) {
                    const similarResponse = await axios.post('http://localhost:5000/api/games/similar', {
                        ids: response.data.similar_games,
                    });
                    setSimilarGames(similarResponse.data);
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching game details.');
            }
        };

        const fetchUserRating = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/rating/${user._id}/${id}`);
                setRating(response?.data?.rating?.rating || 0);
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching user rating.');
            } finally {
                setLoading(false);
            }
        }

        fetchGame();
        fetchUserRating();
    }, [id]);

    const handleRating = async (rating) => {
        setRating(rating);
        try {
            await axios.post(`http://localhost:5000/api/rating/${user._id}/${id}`, {
                rating: rating
            })
        } catch (error) {
            setError(error.response?.data?.error || 'Error posting rating.');
        }
        
    };

    const handleReview = async () => {
        try {
            await axios.post(`http://localhost:5000/api/rating/${user._id}/${id}`, {
                rating: rating,
                review: review
            })
        } catch (error) {
            setError(error.response?.data?.error || 'Error posting review.');
        }
        setReviewButtonText("Submitted!");
        setTimeout(() => {
            setReviewButtonText("Submit");
        }, 200);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleSimilarGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="game-detail">
            <h1>{game.name || 'Unknown Game'}</h1>
            <img src={game.cover_url || 'placeholder-image-url'} alt={game.name} className="game-cover" />
            <StarRating handleRating={handleRating} size={40} rating={rating} />
            <p><strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Release Date:</strong> {game.release_date ? new Date(game.release_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Average User Rating:</strong> {game.total_rating ? `${game.total_rating.toFixed(1) / 10} (${game.total_rating_count} votes)` : 'N/A'}</p>
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
                {similarGames.length ? (
                    <div className="carousel">
                        {similarGames.map((similarGame) => (
                            <div
                                key={similarGame.igdb_id}
                                className="carousel-item"
                                onClick={() => handleSimilarGameClick(similarGame.igdb_id)}
                            >
                                <img src={similarGame.cover_url || 'placeholder-image-url'} alt={similarGame.name} className="carousel-image" />
                                <p>{similarGame.name}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No similar games available.</p>
                )}
            </div>
            
            <div className="leave-review">
                <span className="leave-review-header">
                    <h2 className="leave-review-text">Leave a Review</h2>
                    <StarRating handleRating={handleRating} size={20} rating={rating}/>
                </span>
                <textarea
                    className="review-textarea"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <button className="review-submit-button" onClick={handleReview}>
                    {reviewButtonText}
                </button>
            </div>
        </div>
    );
}

export default GameDetailPage;
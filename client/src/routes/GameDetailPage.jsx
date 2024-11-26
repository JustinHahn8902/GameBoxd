import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import ReactMarkdown from 'react-markdown';
import './GameDetailPage.css';
import StarRating from '../components/StarRating';
import { UserContext } from '../context/UserContext';

function GameDetailPage() {
    const doneLoading = 3;

    const { user } = useContext(UserContext);

    const { id } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(0);
    const [error, setError] = useState('');
    const [similarGames, setSimilarGames] = useState([]);
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [userHasReview, setUserHasReview] = useState(false);
    const [reviewDisabled, setReviewDisabled] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [enhancedDescription, setEnhancedDescription] = useState('');
    const [generatingDescription, setGeneratingDescription] = useState(false);

    useEffect(() => {
        setLoading(0);
        setReview('');
        setRating(0);
        setUserHasReview(false);
        setReviewDisabled(false);
        setError('');
        setReviews([]);

        const fetchGame = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/games/${id}`);
                const gameData = response.data;
                setGame(gameData);

                if (gameData.similar_games?.length) {
                    const similarResponse = await axios.post('http://localhost:5001/api/games/similar', {
                        ids: gameData.similar_games,
                    });
                    setSimilarGames(similarResponse.data);
                }

                // Fetch AI-enhanced description
                await fetchEnhancedDescription(gameData);
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching game details.');
            } finally {
                setLoading((loading) => loading + 1);
            }
        };

        const fetchEnhancedDescription = async (gameData) => {
            try {
                console.log("Sending request with game summary and images:", gameData.summary, gameData.screenshot_urls);
                const response = await axios.post('http://localhost:5001/api/games/generate-description', {
                    description: gameData.name, // Use the game's name as the title
                    images: gameData.screenshot_urls || [], // Pass screenshot URLs
                });
                setEnhancedDescription(response.data.enhancedDescription);
            } catch (error) {
                console.error("Failed to generate enhanced description:", error);
            }
        };





        const fetchUserRating = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/rating/user-rating/${user._id}/${id}`);
                setRating(response?.data?.rating?.rating || 0);
                if (response.data?.rating?.review) {
                    setReview(response.data.rating.review);
                    setUserHasReview(true);
                    setReviewDisabled(true);
                }
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching user rating.');
            } finally {
                setLoading(loading => {
                    return loading + 1;
                });
            }
        }

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/rating/reviews/${id}`);
                setReviews(response.data.reviews.filter((review) => {
                    return review.userId._id !== user._id;
                }) || []);
            } catch (error) {
                setError(error.response?.data?.error || 'Error fetching reviews.');
            } finally {
                setLoading(loading => {
                    return loading + 1;
                });
            }
        }

        fetchGame();
        fetchUserRating();
        fetchReviews();
    }, [id]);

    const handleRating = async (rating) => {
        setRating(rating);
        try {
            await axios.post(`http://localhost:5000/api/rating/user-rating/${user._id}/${id}`, {
                rating: rating,
                review: review
            })
        } catch (error) {
            setError(error.response?.data?.error || 'Error posting rating.');
        }
        
    };

    const handleReviewSubmit = async () => {
        if (rating === 0) {
            alert("Please Rate the Game before Submitting a Review!");
        } else if (review.length === 0) {
            alert("Please Write a Review!");
        } else {
            try {
                await axios.post(`http://localhost:5000/api/rating/user-rating/${user._id}/${id}`, {
                    rating: rating,
                    review: review
                })
            } catch (error) {
                setError(error.response?.data?.error || 'Error posting review.');
            }
            setUserHasReview(true);
            setReviewDisabled(true);
        }
    }

    const handleReviewEdit = () => {
        setUserHasReview(true);
        setReviewDisabled(false);
    }

    const handleSaveReview = async () => {
        if (review.length === 0) {
            alert("Please Write a Review!");
        } else {
            try {
                await axios.post(`http://localhost:5000/api/rating/user-rating/${user._id}/${id}`, {
                    rating: rating,
                    review: review
                });
                setReviewDisabled(true);
                setUserHasReview(true);
            } catch (error) {
                setError(error.response?.data?.error || 'Error saving review.');
            }
        }
    };

    const handleSimilarGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    if (loading < doneLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="game-detail">
            <h1>{game.name || 'Unknown Game'}</h1>
            <img src={game.cover_url || 'placeholder-image-url'} alt={game.name} className="game-cover" />
            <StarRating handleRating={(rating) => setRating(rating)} size={40} rating={rating} />
            <p><strong>Genres:</strong> {game.genres?.join(', ') || 'N/A'}</p>
            <p><strong>Release Date:</strong> {game.release_date ? new Date(game.release_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Average User Rating:</strong> {game.total_rating ? `${game.total_rating.toFixed(1) / 10} (${game.total_rating_count} votes)` : 'N/A'}</p>
            <p><strong>Summary:</strong> {game.summary || 'No summary available.'}</p>

            <div className="enhanced-description-section">
                <h2>AI-Generated Description</h2>
                {generatingDescription ? (
                    <p>Generating enhanced description...</p>
                ) : (
                    enhancedDescription ? (
                        <ReactMarkdown>{enhancedDescription}</ReactMarkdown>
                    ) : (
                        <p>Generating enhanced description...</p>
                    )
                )}
            </div>
            <div className="game-screenshots">
                <h2>Screenshots</h2>
                {game.screenshot_urls?.length ? (
                    game.screenshot_urls.map((url, index) => (
                        <img key={index} src={url} alt={`Screenshot ${index + 1}`} className="game-screenshot"/>
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
                    <h2 className="leave-review-text">{ userHasReview ? "Your Review" : "Leave a Review" }:</h2>
                    <StarRating handleRating={handleRating} size={20} rating={rating}/>
                </span>
                <textarea
                    disabled={reviewDisabled}
                    className="review-textarea"
                    placeholder="Write your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                {userHasReview ? (
                    reviewDisabled ? (
                        <button className="review-submit-button" onClick={handleReviewEdit}>
                            Edit
                        </button>
                    ) : (
                        <button className="review-submit-button" onClick={handleSaveReview}>
                            Save
                        </button>
                    )
                ) : (
                    <button className="review-submit-button" onClick={handleReviewSubmit}>
                        Submit
                    </button>
                )}
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.length ? (
                    <ul>
                        {reviews.map((review) => (
                            <li key={review._id} className="review-item">
                                <StarRating rating={review.rating} canChange={false}/>
                                <p>
                                    By: <strong>{review.userId.username}</strong> 
                                </p>
                                <p className="review-contents">"{review.review}"</p>
                                <p>Last Updated: {new Date(review.updatedAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p>No reviews available for this game.</p>
                )}
            </div>
        </div>
    );
}

export default GameDetailPage;

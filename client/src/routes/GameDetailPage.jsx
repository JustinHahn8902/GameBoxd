import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import ReactMarkdown from 'react-markdown';
import './GameDetailPage.css';
import StarRating from '../components/StarRating';
import { UserContext } from '../context/UserContext';

function GameDetailPage() {
    const doneLoading = 4;

    const { user } = useContext(UserContext);

    const { id } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
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
    const [generatingDescription] = useState(false);
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState('');
    const [selectedList ,setSelectedList] = useState([]);

    useEffect(() => {
        setLoading(0);
        setReview('');
        setRating(0);
        setUserHasReview(false);
        setReviewDisabled(false);
        setError('');
        setReviews([]);
        setLists([]);

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

        const fetchLists = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/lists/user/${user._id}`, {
                    params: { requestingUserId: user._id }
                });
                setLists(response.data);
            } catch (error) {
                console.error('Error fetching list:', error);
            } finally {
                setLoading((loading) => loading + 1);
            }
        };

        const fetchEnhancedDescription = async (gameData) => {
            try {
                console.log("Sending request with game summary and images:", gameData.summary, gameData.screenshot_urls);
                // Use the summary and screenshots for the enhanced description
                const response = await axios.post('http://localhost:5001/api/games/generate-description', {
                    description: gameData.summary || 'No summary available.', // Use summary instead of name
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
        fetchLists();
        fetchUserRating();
        fetchReviews();
    }, [id]);

    const handleRating = async (rating) => {
        setRating(rating);
        try {
            await axios.post(`http://localhost:5001/api/rating/user-rating/${user._id}/${id}`, {
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
                await axios.post(`http://localhost:5001/api/rating/user-rating/${user._id}/${id}`, {
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
                await axios.post(`http://localhost:5001/api/rating/user-rating/${user._id}/${id}`, {
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

    const handleAddToList = async () => {
        if (selectedListId === '') {
            alert("Please select a list first!");
        } else{
            try {
                await axios.post(`http://localhost:5001/api/lists/${selectedListId}/games`, {
                    gameId: id,
                });
                setSelectedList([...selectedList, game._id]);
            } catch (error) {
                setError(error.response?.data?.error || 'Error adding game to list');
            }
        }
    }

    const handleRemoveFromList = async () => {
        try {
            await axios.delete(`http://localhost:5001/api/lists/${selectedListId}/games/${game._id}`);
            setSelectedList(selectedList.filter((gameId) => {
                return gameId !== game._id;
            }));
        } catch (error) {
            setError(error.response?.data?.error || 'Error deleting game from list');
        }
    }

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

            <div className="rating-and-list">
                <StarRating handleRating={(rating) => setRating(rating)} size={40} rating={rating} />
                <div className="add-to-list">
                    <h2>Add To List</h2>
                    <select
                        onChange={(e) => {
                            setSelectedListId(e.target.value);
                            setSelectedList(lists.find((list) => {
                                return list._id === e.target.value;
                            }).games.map((game) => {
                                return game._id
                            }))
                            console.log(lists.find((list) => {
                                return list._id === e.target.value;
                            }).games.map((game) => {
                                return game._id
                            }));
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Select a list
                        </option>
                        {lists.map((list) => (
                            <option key={list._id} value={list._id}>
                                {list.name}
                            </option>
                        ))}
                    </select>
                    { selectedListId !== "Select a list" && selectedList.includes(game._id) ? (
                        <button className="remove-from-list-button" onClick={handleRemoveFromList}>Remove</button>
                    ) : (
                        <button className="add-to-list-button" onClick={handleAddToList}>Add</button>
                    )}
                </div>
            </div>

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
                        <div className="enhanced-description-content">
                            <ReactMarkdown>{enhancedDescription}</ReactMarkdown>
                        </div>
                    ) : (
                        <p>Generating enhanced description...</p>
                    )
                )}
            </div>

            <div className="game-screenshots">
                <h2>Screenshots</h2>
                {game.screenshot_urls?.length ? (
                    game.screenshot_urls.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Screenshot ${index + 1}`}
                            className="game-screenshot"
                            onClick={() => {
                                setCurrentImage(url);
                                setIsModalOpen(true);
                            }}
                        />
                    ))
                ) : (
                    <p>No screenshots available.</p>
                )}
            </div>

            {/* Modal Component */}
            {isModalOpen && (
                <div className="modal" onClick={() => setIsModalOpen(false)}>
                    <img
                        src={currentImage}
                        alt="Full screen screenshot"
                        className="modal-image"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image
                    />
                </div>
            )}
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

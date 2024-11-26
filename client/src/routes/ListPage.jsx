import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './ListPage.css';

function ListPage() {
    const { user } = useContext(UserContext);
    const { listId } = useParams();

    const navigate = useNavigate();

    const [games, setGames] = useState([]);
    const [listUserId, setListUserId] = useState('');
    const [listName, setListName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/lists/list/${listId}`);
                setGames(response.data.games);
                setListUserId(response.data.user);
                setListName(response.data.name);
            } catch (error) {
                setError('Error fetching the list. Please try again later.');
                console.error('Error fetching lists:', error);
            }
        };

        fetchList();
    }, [listId]);

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    return (
        <div className="list-page">
            {error && <p className="error">{error}</p>}
            <h1>{listName}</h1>
            <div className="games-container">
                {games.map((game) => (
                    <div key={game._id} className="game-item" onClick={() => handleGameClick(game.igdb_id)}>
                        <img
                            src={game.cover_url || 'placeholder-image-url'}
                            alt={game.name}
                            className="game-image"
                        />
                        <p className="game-name">{game.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListPage;

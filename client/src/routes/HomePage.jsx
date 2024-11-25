import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [gameId, setGameId] = useState('');

    const handleSearch = (event) => {
        event.preventDefault();
        if (gameId.trim()) {
            navigate(`/game/${gameId}`);
        }
    };

    return (
        <div className="home">
            <p>Home</p>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    placeholder="Enter Game ID"
                    className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
            </form>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={logout}>Log Out</button>
        </div>
    );
}

export default HomePage;
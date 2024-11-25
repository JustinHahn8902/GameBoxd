import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import '../styles.css';

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSearch = async (event) => {
        event.preventDefault();
        if (query.trim()) {
            try {
                const response = await axios.get(`http://localhost:5000/api/games/search?name=${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    };

    const handleResultClick = (id) => {
        navigate(`/game/${id}`);
        setSearchResults([]);
        setQuery('');
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="navbar">
            <div className="navbar-left" onClick={() => navigate('/')}>
                <h1>GameBoxd</h1>
            </div>
            <div className="navbar-middle">
                <form onSubmit={handleSearch} className="navbar-search-form">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter Game Name"
                        className="navbar-search-input"
                    />
                    <button type="submit" className="navbar-search-button">Search</button>
                </form>
                {searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((game) => (
                            <div
                                key={game.igdb_id}
                                className="search-result-item"
                                onClick={() => handleResultClick(game.igdb_id)}
                            >
                                {game.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="navbar-right">
                <div className="profile-picture" onClick={toggleDropdown}>
                    <img src="placeholder-profile-pic-url" alt="Profile" className="profile-picture-img" />
                </div>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <p onClick={() => navigate('/profile')}>Profile</p>
                        <p onClick={() => navigate('/settings')}>Settings</p>
                        <p onClick={() => navigate('/my-lists')}>My Lists</p>
                        <p onClick={logout}>Sign out</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Import UserContext
import './NavBar.css';
import { FiSearch } from 'react-icons/fi';
import DefaultAvatar from '../assets/default-avatar.svg'; // Import default avatar image

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext); // Destructure `user` from the context
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const searchRef = useRef(null);
    const profileRef = useRef(null);

    const handleSearchChange = async (event) => {
        const input = event.target.value;
        setQuery(input);

        if (input.trim() !== '') {
            try {
                const response = await axios.get(`http://localhost:5001/api/games/search?name=${input}`);
                setSearchResults(response.data.slice(0, 10));
                setSearchDropdownOpen(true);
                setProfileDropdownOpen(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setSearchResults([]);
            setSearchDropdownOpen(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowDown') {
            setSelectedItem((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
        } else if (event.key === 'ArrowUp') {
            setSelectedItem((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (event.key === 'Enter') {
            if (selectedItem >= 0) {
                navigate(`/game/${searchResults[selectedItem].igdb_id}`);
                setSearchResults([]);
                setQuery('');
                setSearchDropdownOpen(false);
            } else {
                handleSearchSubmit();
            }
        }
    };

    const handleSearchSubmit = async () => {
        if (query.trim() !== '') {
            try {
                const response = await axios.get(`http://localhost:5001/api/games/search?name=${query}`);
                console.log(response.data);
                setSearchDropdownOpen(false);
            } catch (error) {
                console.error('Error performing search:', error);
            }
        }
    };

    const handleResultClick = (id) => {
        navigate(`/game/${id}`);
        setSearchResults([]);
        setQuery('');
        setSearchDropdownOpen(false);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen((prev) => !prev);
        setSearchDropdownOpen(false);
    };

    const handleClearSearch = () => {
        setQuery('');
        setSearchResults([]);
        setSearchDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setSearchDropdownOpen(false);
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-left" onClick={() => navigate('/')}>
                <h1 className="navbar-logo">GameBoxd</h1>
            </div>
            <div className="navbar-middle" ref={searchRef}>
                <form
                    className="navbar-search-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearchSubmit();
                    }}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Search for games..."
                        className="navbar-search-input"
                    />
                    <button type="submit" className="navbar-search-button">
                        <FiSearch size={20} />
                    </button>
                </form>
                {searchDropdownOpen && searchResults.length > 0 && (
                    <div className="search-results">
                        {searchResults.map((game, index) => (
                            <div
                                key={game.igdb_id}
                                className={`search-result-item ${index === selectedItem ? 'active' : ''}`}
                                onClick={() => handleResultClick(game.igdb_id)}
                            >
                                {game.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="navbar-right" ref={profileRef}>
                <div className="profile-picture" onClick={toggleProfileDropdown}>
                    <img
                        src={user?.avatar || DefaultAvatar}
                        alt="Profile"
                        className="profile-picture-img"
                        onError={(e) => (e.target.src = DefaultAvatar)}
                    />
                </div>
                {profileDropdownOpen && (
                    <div className="dropdown-menu">
                        <p onClick={() => navigate('/profile')}>Profile</p>
                        <p onClick={() => navigate('/settings')}>Settings</p>
                        <p onClick={() => navigate('/my-lists')}>My Lists</p>
                        <p
                            onClick={() => {
                                logout();
                                navigate('/login'); // Redirect to login page after logout
                            }}
                        >
                            Sign out
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;

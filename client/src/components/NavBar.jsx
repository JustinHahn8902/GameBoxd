import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext'; // Import UserContext
import './NavBar.css';
import { FiSearch } from 'react-icons/fi';
import { FiFilter } from 'react-icons/fi'; // Import filter icon
import DefaultAvatar from '../assets/default-avatar.svg'; // Import default avatar image

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext); // Destructure `user` from the context
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false); // Track filter dropdown
    const searchRef = useRef(null);
    const profileRef = useRef(null);
    const filterRef = useRef(null);

    const genres = [
        'Shooter', 'Role-Playing (RPG)', 'Simulator', 'Strategy',
        'Turn-based Strategy (TBS)', 'Tactical', 'Adventure', 'Arcade',
        'Fighting', 'Platform', 'Indie', 'Puzzle', 'Visual Novel',
        'Racing', 'Hack and slash/Beat \'em up', 'Point-and-click',
        'Sport', 'Music', 'Real Time Strategy (RTS)'
    ];

    const handleSearchChange = async (event) => {
        const input = event.target.value;
        setQuery(input);

        if (input.trim() !== '') {
            try {
                const response = await axios.get(`http://localhost:5001/api/games/search?name=${input}`);
                setSearchResults(response.data.slice(0, 10));
                setSearchDropdownOpen(true);
                setProfileDropdownOpen(false);
                setFilterDropdownOpen(false);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setSearchResults([]);
            setSearchDropdownOpen(false);
        }
    };

    const handleFilterSelect = (genre) => {
        setFilterDropdownOpen(false);
        navigate(`/games/genre/${genre}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                profileRef.current &&
                !profileRef.current.contains(event.target) &&
                filterRef.current &&
                !filterRef.current.contains(event.target)
            ) {
                setSearchDropdownOpen(false);
                setProfileDropdownOpen(false);
                setFilterDropdownOpen(false);
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
                        setSearchDropdownOpen(false);
                    }}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
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
                                className="search-result-item"
                                onClick={() => navigate(`/game/${game.igdb_id}`)}
                            >
                                {game.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="filter-section" ref={filterRef}>
                <button
                    className="navbar-filter-button"
                    onClick={() => setFilterDropdownOpen((prev) => !prev)}
                >
                    <FiFilter size={20} />
                </button>
                {filterDropdownOpen && (
                    <div className="filter-dropdown">
                        {genres.map((genre, index) => (
                            <div
                                key={index}
                                className="filter-item"
                                onClick={() => handleFilterSelect(genre)}
                            >
                                {genre}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="navbar-right" ref={profileRef}>
                <div className="profile-picture" onClick={() => setProfileDropdownOpen((prev) => !prev)}>
                    <img
                        src={user?.avatar || DefaultAvatar}
                        alt="Profile"
                        className="profile-picture-img"
                    />
                </div>
                {profileDropdownOpen && (
                    <div className="dropdown-menu">
                        <p onClick={() => navigate('/profile')}>Profile</p>
                        <p onClick={() => navigate('/settings')}>Settings</p>
                        <p onClick={() => navigate('/my-lists')}>My Lists</p>
                        <p onClick={() => navigate('/user-search')}>User Search</p>
                        <p
                            onClick={() => {
                                logout();
                                navigate('/login');
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

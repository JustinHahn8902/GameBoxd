import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavBar'; // Import the Navbar
import './UserSearchPage.css';

function UserSearchPage() {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserLists, setSelectedUserLists] = useState([]);
    const [error, setError] = useState('');

    // Search users by username
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/users/search?username=${query}`);
            setUsers(response.data);
            setSelectedUserLists([]); // Clear previously selected user's lists
            setError('');
        } catch (err) {
            setError('Error fetching users.');
        }
    };

    // Fetch lists (and games) for a selected user
    const fetchUserLists = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/lists/user/${userId}`);
            setSelectedUserLists(response.data); // Update state with user lists
            setError(''); // Clear any previous error
        } catch (err) {
            console.error(`Error fetching lists for user ${userId}:`, err.message);
            setError('Error fetching user lists.');
        }
    };


    return (
        <>
            <div className="user-search-page">
                <h1>User Search</h1>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a user"
                        className="search-input"
                    />
                    <button type="submit" className="search-button">Search</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <div className="search-results">
                    <h2>Search Results</h2>
                    <ul>
                        {users.map((user) => (
                            <li key={user._id}>
                                <button onClick={() => fetchUserLists(user._id)} className="user-button">
                                    {user.username}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedUserLists.length > 0 ? (
                    <div className="user-lists">
                        <h2>User Lists</h2>
                        <ul>
                            {selectedUserLists.map((list) => (
                                <li key={list._id} className="list-item">
                                    <h3>{list.name}</h3>
                                    <p>Public: {list.isPublic ? 'Yes' : 'No'}</p>
                                    {list.games.length > 0 ? (
                                        <ul>
                                            {list.games.map((game) => (
                                                <li key={game._id}>
                                                    <strong>{game.name}</strong>
                                                    <p>{game.summary}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No games in this list</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No lists found for this user.</p>
                )}
            </div>
        </>
    );
}

export default UserSearchPage;

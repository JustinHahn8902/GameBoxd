import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import '../styles.css';

function MyListsPage() {
    const { user } = useContext(UserContext);
    const [lists, setLists] = useState([]);
    const [newListName, setNewListName] = useState('');
    const [isPublic, setIsPublic] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/lists/user/${user._id}`, {
                    params: { requestingUserId: user._id }
                });
                setLists(response.data);
            } catch (error) {
                console.error('Error fetching list:', error);
            }
        };

        fetchLists();
    }, [user._id]);

    const handleCreateList = async () => {
        if (newListName.length === 0) {
            alert("Please Enter a List Name!");
        } else {
            try {
                const response = await axios.post('http://localhost:5001/api/lists/create-list', {
                    name: newListName,
                    userId: user._id,
                    isPublic
                });
                setLists([...lists, response.data]);
                setNewListName('');
            } catch (error) {
                console.error('Error creating list:', error);
            }
        }
    };

    const handleDeleteList = async (listId) => {
        try {
            await axios.delete(`http://localhost:5001/api/lists/${listId}`);
            setLists(lists.filter(list => list._id !== listId));
        } catch (error) {
            console.error('Error deleting list:', error);
        }
    };

    const handleTogglePrivacy = async (listId, currentPrivacy) => {
        try {
            const response = await axios.patch(`http://localhost:5001/api/lists/${listId}`, {
                isPublic: !currentPrivacy
            });
            setLists(lists.map(list => list._id === listId ? response.data : list));
        } catch (error) {
            console.error('Error toggling privacy:', error);
        }
    };

    const handleViewList = (listId) => {
        navigate(`/list/${listId}`);
    };

    return (
        <div className="my-lists-page">
            <h1>My Lists</h1>
            <div className="create-list-form">
                <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New List Name"
                />
                <label className='my-lists-checkbox-label'>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                    />
                    Public
                </label>
                <button onClick={handleCreateList}>Create List</button>
            </div>
            <div className="lists-container">
                {lists.map(list => (
                    <div key={list._id} className="list-item">
                        <h2>{list.name}</h2>
                        <button onClick={() => handleDeleteList(list._id)}>Delete</button>
                        <button onClick={() => handleTogglePrivacy(list._id, list.isPublic)}>
                            {list.isPublic ? 'Make Private' : 'Make Public'}
                        </button>
                        <button onClick={() => handleViewList(list._id)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyListsPage;
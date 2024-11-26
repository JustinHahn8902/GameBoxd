import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async ({ username, password }) => {
        await axios.post('http://localhost:5001/api/auth/login', { username, password })
            .then(response => {
                if (response.status === 200) {
                    setUser(response.data.user);
                    navigate('/');
                } else {
                    setUser(null);
                }
            }).catch(() => {
                setUser(null);
            });
    };

    const register = async ({ username, password }) => {
        await axios.post('http://localhost:5001/api/auth/register', { username, password })
            .then(response => {
                if (response.status === 201) {
                    setUser(response.data.user);
                    navigate('/');
                } else {
                    setUser(null);
                }
            }).catch(() => {
                setUser(null);
            });
    };

    return (
        <UserContext.Provider value={{ user, login, register }}>
            {children}
        </UserContext.Provider>
    );
};
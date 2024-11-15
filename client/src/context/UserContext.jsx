import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8080/user', { withCredentials: true })
            .then(response => {
                setUser(response.data);
            }).catch(() => {
                setUser(null);
            });
    }, []);

    const logout = () => {
        axios.post('http://localhost:8080/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                navigate('/');
            }).catch(() => {
                setUser(null);
                navigate('/');
            });
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};
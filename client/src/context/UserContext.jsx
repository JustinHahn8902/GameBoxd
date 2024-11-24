import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async ({ username, password }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            if (response.status == 200) {
                setUser(response.data.user);
                navigate('/');
            } else {
                setUser(null);
                return response.data.error;
            }
        } catch (error) {
            setUser(null);
            return error.response.data.error;
        }
    };

    const register = async ({ username, password }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { username, password });
            if (response.status == 201) {
                setUser(response.data.user);
                navigate('/');
            } else {
                setUser(null);
                return response.data.error;
            }
        } catch (error) {
            setUser(null);
            return error.response.data.error;
        }
    };

    const logout = () => {
        setUser(null);
        navigate('/');
    }

    return (
        <UserContext.Provider value={{ user, login, register, logout }}>
            {children}
        </UserContext.Provider>
    );
};
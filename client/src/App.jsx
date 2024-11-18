import './styles.css';
import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import HomePage from './routes/HomePage';
import ProfilePage from './routes/ProfilePage';

function App() {
  // const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={/*user ? (<HomePage />) : (*/<LoginPage />/*)*/} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

export default App;
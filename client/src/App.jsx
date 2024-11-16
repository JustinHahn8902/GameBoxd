import './styles.css';
import React, { useState, useEffect, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './routes/LandingPage';
import Home from './routes/Home';
import Profile from './routes/Profile';

function App() {
  // const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={/*user ? (<Home/>) : (*/<LandingPage/>/*)*/} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
  );
}

export default App;
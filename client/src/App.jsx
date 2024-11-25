import './styles.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import HomePage from './routes/HomePage';
import ProfilePage from './routes/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import GameDetailPage from './routes/GameDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      <Route path="/game/:id" element={<ProtectedRoute><GameDetailPage/></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
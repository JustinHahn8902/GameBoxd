import './styles.css';
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import HomePage from './routes/HomePage';
import ProfilePage from './routes/ProfilePage';
import ProtectedRoute from './ProtectedRoute';
import GameDetailPage from './routes/GameDetailPage';
import Navbar from './components/NavBar';
import { UserContext } from './context/UserContext';

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage/></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
          <Route path="/game/:id" element={<ProtectedRoute><GameDetailPage/></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
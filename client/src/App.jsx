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
import MyListsPage from './routes/MyListsPage';
import { UserContext } from './context/UserContext';
import FolProfilePage from './routes/FolProfilePage';
import ListPage from './routes/ListPage';
import UserSearchPage from "./routes/UserSearchPage";

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
          <Route path="/my-lists" element={<ProtectedRoute><MyListsPage/></ProtectedRoute>} />
          <Route path="/fol-user" element={<ProtectedRoute><FolProfilePage /></ProtectedRoute>} />
          <Route path="/list/:listId" element={<ProtectedRoute><ListPage /></ProtectedRoute>} />
          <Route path="/user-search" element={<UserSearchPage />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
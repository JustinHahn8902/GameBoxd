import React, { useContext } from 'react';
import { UserContext } from './context/UserContext';
import LoginPage from './routes/LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <LoginPage />;
  }

  return children;
};

export default ProtectedRoute;

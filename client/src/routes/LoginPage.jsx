import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './LoginPage.css';

function LoginPage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (username === '' || password === '') {
      setUsernameInvalid(username === '');
      setPasswordInvalid(password === '');
    } else {
      setUsernameInvalid(false);
      setPasswordInvalid(false);

      const error = await login({ username, password });
      if (error) {
        setErrorMessage(error);
      }
    }
  };

  return (
    <div className="login-page-container">
      
      <div className="background-layer background-layer-1"></div>
      <div className="background-layer background-layer-2"></div>
      <div className="background-layer background-layer-3"></div>

      <div className="login-page-box">
        <h1>Welcome to GameBoxd!</h1>
        <div className="login-page-username-input">
          Username: <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        {usernameInvalid && <p className="login-page-invalid">Username Invalid</p>}
        <div className="login-page-password-input">
          Password: <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {passwordInvalid && <p className="login-page-invalid">Password Invalid</p>}
        {errorMessage && <p className="login-page-invalid">{errorMessage}</p>}
        <button onClick={handleLogin} className="login-page-button">
          Log In
        </button>
        <button onClick={() => navigate('/register')} className="login-page-register-button">
          Register
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
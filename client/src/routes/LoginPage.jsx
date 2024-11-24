import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import '../styles.css'

function LoginPage() {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);

    const handleLogin = async () => {

        if (username == '' || password == '') {
            if (username == '') {setUsernameInvalid(true)} else {setUsernameInvalid(false)}
            if (password == '') {setPasswordInvalid(true)} else {setPasswordInvalid(false)}
        } else {
            setUsernameInvalid(false);
            setPasswordInvalid(false);

            await login({ username, password });
        }
    }

    return (
        <div className="login">
            <h1>Welcome to GameBoxd</h1>
            <div className="login-box">
                <div className='login-username-input'>
                    Username: <input value={username} onChange={e => setUsername(e.target.value)}/>
                </div>
                {usernameInvalid ? (<p className='login-invalid'>Username Invalid</p>) : null}
                <div className='login-password-input'>
                    Password: <input value={password} onChange={e => setPassword(e.target.value)}/>
                </div>
                {passwordInvalid ? (<p className='login-invalid'>Password Invalid</p>) : null}
                <button onClick={handleLogin} className="login-button">
                    Log In
                </button>
                <button onClick={() => navigate('/register')} className="register-button">
                    Register
                </button>
            </div>
        </div>
    )
}

export default LoginPage;
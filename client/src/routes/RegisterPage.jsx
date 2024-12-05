import './RegisterPage.css';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function RegisterPage() {
    const { register } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameInvalid, setUsernameInvalid] = useState(false);
    const [passwordInvalid, setPasswordInvalid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async () => {

        if (username === '' || password === '' || password !== confirmPassword) {
            if (username === '') {setUsernameInvalid(true)} else {setUsernameInvalid(false)}
            if (password === '' || password !== confirmPassword) {setPasswordInvalid(true)} else {setPasswordInvalid(false)}
        } else {
            setUsernameInvalid(false);
            setPasswordInvalid(false);

            const error = await register({ username, password });
            if (error) {
                setErrorMessage(error);
            }
        }
    }

    return (
        <div className="register">
            <h1>Register Below</h1>
            <div className="register-box">
                <div className='register-username-input'>
                    Username: <input value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                {usernameInvalid ? (<p className='login-invalid'>Username Invalid</p>) : null}
                <div className='register-password-input'>
                    Password: <input value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <div className='register-password-confirm-input'>
                    Confirm Password: <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                {passwordInvalid ? (<p className='login-invalid'>Password Invalid</p>) : null}
                {errorMessage ? (<p className='login-invalid'>{errorMessage}</p>) : null}
                <button onClick={handleRegister} className="login-button">
                    Register
                </button>
                <button onClick={() => navigate('/')} className="register-button">
                    Log In
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;
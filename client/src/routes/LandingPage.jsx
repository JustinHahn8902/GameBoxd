import React, { useContext } from 'react';
import axios from 'axios';
// import { UserContext } from '../context/UserContext';
import '../styles.css'

function LandingPage() {
    // const { user } = useContext(UserContext);

    const googleLogin = () => {
        window.location.href = "http://localhost:5000/oauth2/authorization/google";
    }

    return (
        <div className="landing">
            <h1>Welcome to GameBoxd</h1>
            <div className="login-box">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" alt="Google Logo" className="google-logo-header" />
                <p>Login with your Google account</p>
                <button onClick={googleLogin} className="login-button">
                    Login with Google
                </button>
            </div>
        </div>
    )
}

export default LandingPage;
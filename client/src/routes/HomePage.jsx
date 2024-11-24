import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);

    return (
        <div>
            <p>Home</p>
            <button onClick={() => {navigate('/profile')}}>Profile</button>
            <button onClick={logout}>Log Out</button>
        </div>
    );
}

export default HomePage;
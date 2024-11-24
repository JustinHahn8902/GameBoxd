import '../styles.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div>
            <p>Home</p>
            <button onClick={() => {navigate('/profile')}}>Profile</button>
        </div>
    );
}

export default HomePage;
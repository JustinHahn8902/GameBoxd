import FolProfileBox from '../components/FolProfileBox';
import '../styles.css';
import { useLocation } from 'react-router-dom';

function FolProfilePage() {
    const location = useLocation();
    const { user } = location.state || "";

    return (
        <div className='profile'>
            <FolProfileBox username={user}/>
        </div>
    );
}

export default FolProfilePage;
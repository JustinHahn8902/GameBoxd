import React, {useState, useEffect, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './GameDetailPage.css';

function ListPage() {
    const { user } = useContext(UserContext);
    const { listId } = useParams();

    const [userCanViewList, setUserCanViewList] = useState(false);

    useEffect(() => {
        const fetchList = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/lists/list/${listId}`);
                console.log("LOOK", response);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        };

        fetchList();
    }, [])

    return (
        <div className="game-detail">
            HELLO
        </div>
  );
}

export default ListPage;

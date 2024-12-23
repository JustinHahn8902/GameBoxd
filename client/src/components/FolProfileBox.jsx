import React, { useContext, useEffect, useState } from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import '../styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const FolProfileBox = ({ username }) => {
    const { user } = useContext(UserContext);
    const [folUser, setFolUser] = useState(null);
    const [folUserFollowers, setFolUserFollowers] = useState([]);
    const navigate = useNavigate();
    const [followText, setFollowText] = useState('Follow');

    useEffect(() => {
        const getUser = async () => {
            let res = await axios.post('http://localhost:5001/api/users/folUser', {username: username});
            if (res.status == 200) {
                setFolUser(res.data.user);
                setFolUserFollowers(res.data.user.followers);
            } else {
                console.log("Error occured");
            }
        }

        if (folUser == null) {
            getUser();
            const idx = user.following.indexOf(username);
            if (idx > -1) {
                setFollowText("Unfollow");
            }
        }
    }, []);

    const PeopleList = ({ title, items, handleClick }) => {
        return (
            <div className='profile-people-box'>
                <p>{title}</p>
                <ul id='people-list'>
                    {items.map((item, index) => (
                        <li key={index} onClick={() => handleClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const clickOnPerson = (person) => {
        navigate('/fol-user', { state: { user: person }});
    }

    const handleFollowClick = async () => {
        console.log("Handling follow");

        if (followText == "Follow") {
            user?.following.push(username);

            const newArr = [...folUserFollowers, user?.username];
            setFolUserFollowers(newArr);
            folUser.followers = newArr;

            await axios.post('http://localhost:5001/api/auth/update', { username: user?.username, followers: user?.followers, following: user?.following });
            await axios.post('http://localhost:5001/api/auth/update', { username: folUser.username, followers: newArr, following: folUser.following });

            setFollowText("Unfollow");
        } else {
            const idx = user?.following.indexOf(username);
            if (idx > -1) {
                user?.following.splice(idx, 1);
            }
            
            const newArr = folUserFollowers.filter(name => name !== user?.username);
            setFolUserFollowers(newArr);
            folUser.followers = newArr;

            await axios.post('http://localhost:5001/api/auth/update', { username: user?.username, followers: user?.followers, following: user?.following });
            await axios.post('http://localhost:5001/api/auth/update', { username: folUser.username, followers: newArr, following: folUser.following });

            setFollowText("Follow");
        }
    };

    return (
        <div className='profile-wrapper'>
            <PeopleList title='Followers:' items={folUserFollowers || []} handleClick={clickOnPerson} />
            <div className='profile-attribute-box'>

                <p className='profile-title'>Profile</p>

                <div className='profile-username-card'>
                    <div className='profile-username-left'>
                        <p>Username:</p>
                    </div>
                    <div className='profile-username-right'>
                        <p>{folUser ? folUser.username : 'N/A'}</p>
                    </div>
                </div>

                <div className='profile-avatar-card'>
                    <div className='profile-avatar-left'>
                        <p>Avatar:</p>
                    </div>
                    <div className='profile-avatar-right'>
                        <div className='profile-avatar-container'>
                            <img src={folUser?.avatar || DefaultAvatar} className='profile-avatar' />
                        </div>
                    </div>
                </div>

                <div className='profile-bio-card'>
                    <div className='profile-bio-left'>
                        <p>Bio:</p>
                    </div>
                    <div className='profile-bio-right'>
                        <textarea rows={8} defaultValue={folUser?.bio} value={folUser?.bio} placeholder='' readOnly={true} spellCheck={false} />
                    </div>
                </div>

                <button className='profile-save-changes-button' onClick={handleFollowClick}>
                    {followText}
                </button>
            </div>
            <PeopleList title='Following:' items={folUser?.following || []} handleClick={clickOnPerson} />
        </div>
    );
}

export default FolProfileBox;
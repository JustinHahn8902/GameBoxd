import React, { useContext, useState } from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import EditAvatar from '../assets/edit-avatar.svg';
import '../styles.css';
import { UserContext } from '../context/UserContext';

function ProfileBox() {
    const user = useContext(UserContext);
    const [avatar, setAvatar] = useState(user?.avatar || DefaultAvatar);

    const handleChangeImage = () => {
        document.getElementById("file-input").click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
        }
    }

    return (
        <div className='profile-attribute-box'>

            <p className='profile-title'>Profile</p>

            <div className='profile-username-card'>
                <div className='profile-username-left'>
                    <p>Username:</p>
                </div>
                <div className='profile-username-right'>
                    <p>{user ? user.name : 'N/A'}</p>
                </div>
            </div>

            <div className='profile-avatar-card'>
                <div className='profile-avatar-left'>
                    <p>Avatar:</p>
                </div>
                <div className='profile-avatar-right'>
                    <div className='profile-avatar-container'>
                        <img src={avatar} className='profile-avatar' />
                        <img src={EditAvatar} className='edit-avatar' onClick={handleChangeImage}/>
                        <input id="file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                    </div>
                </div>
            </div>

            <div className='profile-bio-card'>
                <div className='profile-bio-left'>
                    <p>Bio:</p>
                </div>
                <div className='profile-bio-right'>
                    <p>{user ? user.bio : ''}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfileBox;
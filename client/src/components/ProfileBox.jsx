import React, { useContext, useState } from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import EditAvatar from '../assets/edit-avatar.svg';
import '../styles.css';
import { UserContext } from '../context/UserContext';

function ProfileBox() {
    const user = useContext(UserContext);
    const [avatar, setAvatar] = useState(user?.avatar || DefaultAvatar);
    const [changedAvatar, setChangedAvatar] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [changedBio, setChangedBio] = useState(false);
    const [readOnlyBio, setReadOnlyBio] = useState(true);

    const handleChangeImage = () => {
        document.getElementById("file-input").click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            setChangedAvatar(true);
        }
    }

    const handleBioChange = (event) => {
        setBio(event.target.value);
        setChangedBio(true);
    }

    const handleSaveChanges = () => {
        if (changedAvatar) {
            console.log("Change avatar in database!");
            setChangedAvatar(false);
            // TODO: Put functionality to save avatar changes to database
        }

        if (changedBio) {
            console.log("Change bio in database!");
            setChangedBio(false);
            // TODO: Put functionality to save bio changes to database
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
                    <textarea rows={8} defaultValue={bio} value={bio} onChange={handleBioChange} placeholder='Input a bio' readOnly={readOnlyBio} spellCheck={false} />
                    <button onClick={() => {setReadOnlyBio(false)}}>
                        Edit Bio
                    </button>
                </div>
            </div>

            <button className='profile-save-changes-button' onClick={handleSaveChanges}>
                Save Changes
            </button>
        </div>
    );
}

export default ProfileBox;
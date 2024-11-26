import React, { useContext, useState } from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import EditAvatar from '../assets/edit-avatar.svg';
import '../styles.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ProfileBox() {
    const { user } = useContext(UserContext);
    const [avatar, setAvatar] = useState(user?.avatar || DefaultAvatar);
    const [changedAvatar, setChangedAvatar] = useState(false);
    const [bio, setBio] = useState(user?.bio || '');
    const [changedBio, setChangedBio] = useState(false);
    const [readOnlyBio, setReadOnlyBio] = useState(true);
    const navigate = useNavigate();

    const handleChangeImage = () => {
        document.getElementById("file-input").click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            console.log(imageUrl);
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
            user.avatar = avatar;
            // TODO: Put functionality to save avatar changes to database
        }

        if (changedBio) {
            console.log("Change bio in database!");
            setChangedBio(false);
            user.bio = bio;
            // TODO: Put functionality to save bio changes to database
        }

        console.log(user);
    }

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

    return (
        <div className='profile-wrapper'>
            <PeopleList title='Followers:' items={user?.followers} handleClick={clickOnPerson} />
            <div className='profile-attribute-box'>

                <p className='profile-title'>Profile</p>

                <div className='profile-username-card'>
                    <div className='profile-username-left'>
                        <p>Username:</p>
                    </div>
                    <div className='profile-username-right'>
                        <p>{user ? user.username : 'N/A'}</p>
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
            <PeopleList title='Following:' items={user?.following} handleClick={clickOnPerson} />
        </div>
    );
}

export default ProfileBox;
import React, { useContext, useState } from 'react';
import DefaultAvatar from '../assets/default-avatar.svg';
import EditIcon from '../assets/edit-avatar.svg';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './ProfileBox.css';

function PeopleList({ title, items, handleClick }) {
    return (
        <div className="profile-people-box">
            <h2 className="people-title">{title}</h2>
            <ul className="people-list">
                {items.length > 0 ? (
                    items.map((person, index) => (
                        <li key={index} className="people-list-item" onClick={() => handleClick(person)}>
                            <img
                                src={person.avatar || DefaultAvatar}
                                alt={`${person.username}'s avatar`}
                                className="people-list-avatar"
                            />
                            <span className="people-list-username">{person.username}</span>
                        </li>
                    ))
                ) : (
                    <li className="people-list-empty">No users to display.</li>
                )}
            </ul>
        </div>
    );
}

function ProfileBox() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    // Avatar state
    const [avatar, setAvatar] = useState(user?.avatar || DefaultAvatar);
    const [isAvatarChanged, setIsAvatarChanged] = useState(false);

    // Bio state
    const [bio, setBio] = useState(user?.bio || '');
    const [isBioChanged, setIsBioChanged] = useState(false);
    const [isBioReadOnly, setIsBioReadOnly] = useState(true);

    // Handle avatar change
    const handleChangeImage = () => {
        document.getElementById('file-input').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setAvatar(imageUrl);
            setIsAvatarChanged(true);
        }
    };

    // Handle bio change
    const handleBioChange = (event) => {
        setBio(event.target.value);
        setIsBioChanged(true);
    };

    // Save changes
    const handleSaveChanges = () => {
        if (isAvatarChanged) {
            console.log('Change avatar in database!');
            setIsAvatarChanged(false);
            user.avatar = avatar;
            // TODO: Implement functionality to save avatar changes to the database
        }

        if (isBioChanged) {
            console.log('Change bio in database!');
            setIsBioChanged(false);
            user.bio = bio;
            // TODO: Implement functionality to save bio changes to the database
        }

        console.log(user);
        setIsBioReadOnly(true);
    };

    // Navigate to user's profile
    const handlePersonClick = (person) => {
        navigate('/fol-user', { state: { user: person } });
    };

    return (
        <div className="profile-wrapper">
            <PeopleList title="Followers" items={user?.followers || []} handleClick={handlePersonClick} />

            <div className="profile-attribute-box">
                <h1 className="profile-title">Profile</h1>

                <div className="profile-avatar-section">
                    <div className="avatar-container">
                        <img src={avatar} alt="User Avatar" className="profile-avatar" />
                        <div className="edit-icon-container" onClick={handleChangeImage}>
                            <img src={EditIcon} alt="Edit Avatar" className="edit-avatar-icon" />
                        </div>
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="username-display">{user ? user.username : 'N/A'}</p>
                </div>

                <div className="profile-bio-section">
                    <h2>Bio</h2>
                    <textarea
                        className="bio-textarea"
                        rows={5}
                        value={bio}
                        onChange={handleBioChange}
                        placeholder="Tell us about yourself..."
                        readOnly={isBioReadOnly}
                        spellCheck={false}
                    />
                    <div className="bio-buttons">
                        {isBioReadOnly ? (
                            <button className="edit-bio-button" onClick={() => setIsBioReadOnly(false)}>
                                Edit Bio
                            </button>
                        ) : (
                            <button className="save-bio-button" onClick={handleSaveChanges}>
                                Save Bio
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <PeopleList title="Following" items={user?.following || []} handleClick={handlePersonClick} />
        </div>
    );
}

export default ProfileBox;

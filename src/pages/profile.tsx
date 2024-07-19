import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';

const Profile: React.FC = () => {
    const { data: session } = useSession();
    const [profileData, setProfileData] = useState<any>(null);
    const [readingLists, setReadingLists] = useState({
        read: 0,
        reading: 0,
        'to-read': 0,
    });

    useEffect(() => {
        if (session) {
            fetch('/api/profile')
                .then(response => response.json())
                .then(data => setProfileData(data))
                .catch(error => console.error('Error fetching profile:', error));

            fetch(`/api/reading-list-count?user_id=${session.user.id}`)
                .then(response => response.json())
                .then(data => setReadingLists(data))
                .catch(error => console.error('Error fetching reading list count:', error));
        }
    }, [session]);

    return (
        <div>
            <Header />
            <h1>Profile</h1>
            {profileData && <p>{profileData.name}</p>}
            <div>
                <h2>Followers: {profileData?.followers}</h2>
                <h2>Following: {profileData?.following}</h2>
            </div>
            <div>
                <h2>Reading Lists</h2>
                <p>Read: {readingLists.read}</p>
                <p>Reading: {readingLists.reading}</p>
                <p>To Read: {readingLists['to-read']}</p>
            </div>
        </div>
    );
};

export default Profile;

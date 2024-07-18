import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

const Profile: React.FC = () => {
    const [data, setData] = useState<{ message: string } | null>(null);
    const [followers, setFollowers] = useState<number>(0);
    const [following, setFollowing] = useState<number>(0);
    const [readingLists, setReadingLists] = useState({
        Lidos: 0,
        Lendo: 0,
        'Para ler': 0
    });

    useEffect(() => {
        fetch('/api/profile')
            .then(response => response.json())
            .then(data => setData(data));
        
        // Fetch followers count
        fetch('/api/followers-count')
            .then(response => response.json())
            .then(data => {
                setFollowers(data.followers);
                setFollowing(data.following);
            });

        // Fetch reading lists count
        fetch('/api/reading-list-count')
            .then(response => response.json())
            .then(data => {
                setReadingLists(data);
            });
    }, []);

    return (
        <div>
            <Header />
            <h1>Profile</h1>
            {data && <p>{data.message}</p>}
            <div>
                <h2>Followers: {followers}</h2>
                <h2>Following: {following}</h2>
            </div>
            <div>
                <h2>Reading Lists</h2>
                <p>Lidos: {readingLists.Lidos}</p>
                <p>Lendo: {readingLists.Lendo}</p>
                <p>Para ler: {readingLists['Para ler']}</p>
            </div>
        </div>
    );
};

export default Profile;

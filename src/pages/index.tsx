import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Header from '../components/Header';

const Home: React.FC = () => {
	const { data: session, status } = useSession();
	const [data, setData] = useState<{ message: string } | null>(null);

	useEffect(() => {
		fetch('/api/home')
		.then(response => response.json())
		.then(data => setData(data));
	}, []);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	return (
		<div>
		<Header />
		<h1>Home</h1>
		{session ? (
			<p>Welcome, {session.user?.name || session.user?.email}</p>
		) : (
			<p>Please sign in</p>
		)}
		{data && <p>{data.message}</p>}
		</div>
	);
};

export default Home;

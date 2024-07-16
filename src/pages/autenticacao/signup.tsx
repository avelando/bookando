import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        if (response.ok) {
            router.push('/autenticacao/login');
        } else {
            // handle error
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <h1>Signup</h1>
                <form onSubmit={handleSignup}>
                <div className="name">
                    <label>Name:</label>
                    <input
                    className="input"
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    />
                </div>
                <div className="email">
                    <label>Email:</label>
                    <input
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="password">
                    <label>Password:</label>
                    <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <button type="submit">Signup</button>
                </form>
                <p>Já possui uma conta? <a href="/autenticacao/login">Login</a></p>
            </div>
        </div>
    );
};

export default Signup;

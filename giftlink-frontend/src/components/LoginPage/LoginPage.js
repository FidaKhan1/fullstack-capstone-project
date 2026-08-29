import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import '../RegisterPage/RegisterPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('auth-token') || ''}`,
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || 'Login failed');
            return;
        }

        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('email', data.userEmail);
        sessionStorage.setItem('name', data.userName);
        setIsLoggedIn(true);
        setUserName(data.userName);
        navigate('/app');
    };

    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleLogin}>
                <p className="eyebrow">Welcome back</p>
                <h1>Log in to GiftLink</h1>
                <label className="form-label mt-3">Email<input className="form-control" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
                <label className="form-label mt-3">Password<input className="form-control" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
                {message && <div className="alert alert-danger mt-3">{message}</div>}
                <button className="btn btn-primary mt-3" type="submit">Log in</button>
                <p className="mt-3 mb-0">Need an account? <Link to="/app/register">Register</Link></p>
            </form>
        </main>
    );
}

export default LoginPage;

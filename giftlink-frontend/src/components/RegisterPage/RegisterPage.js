import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { setIsLoggedIn, setUserName } = useAppContext();

    const handleRegister = async (event) => {
        event.preventDefault();
        setMessage('');

        const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('auth-token') || ''}`,
            },
            body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) {
            setMessage(data.error || 'Registration failed');
            return;
        }

        sessionStorage.setItem('auth-token', data.authtoken);
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('name', data.userName);
        setIsLoggedIn(true);
        setUserName(data.userName);
        navigate('/app');
    };

    const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

    return (
        <main className="auth-page">
            <form className="auth-card" onSubmit={handleRegister}>
                <p className="eyebrow">Join GiftLink</p>
                <h1>Create an account</h1>
                <p className="text-muted">Save useful items from going to waste.</p>
                <div className="row g-3">
                    <div className="col-md-6"><label className="form-label">First name<input className="form-control" name="firstName" value={form.firstName} onChange={update} required /></label></div>
                    <div className="col-md-6"><label className="form-label">Last name<input className="form-control" name="lastName" value={form.lastName} onChange={update} required /></label></div>
                    <div className="col-12"><label className="form-label">Email<input className="form-control" type="email" name="email" value={form.email} onChange={update} required /></label></div>
                    <div className="col-12"><label className="form-label">Password<input className="form-control" type="password" name="password" value={form.password} onChange={update} minLength="8" required /></label></div>
                </div>
                {message && <div className="alert alert-danger mt-3">{message}</div>}
                <button className="btn btn-primary mt-3" type="submit">Register</button>
                <p className="mt-3 mb-0">Already registered? <Link to="/app/login">Log in</Link></p>
            </form>
        </main>
    );
}

export default RegisterPage;

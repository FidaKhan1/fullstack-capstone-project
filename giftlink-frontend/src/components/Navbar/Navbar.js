import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';

export default function Navbar() {
    const { isLoggedIn, setIsLoggedIn, userName } = useAppContext();
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.clear();
        setIsLoggedIn(false);
        navigate('/app');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
            <Link className="navbar-brand" to="/app">GiftLink</Link>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item"><Link className="nav-link" to="/app">Gifts</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/app/search">Search</Link></li>
                </ul>
                <div className="d-flex gap-2 align-items-center">
                    {isLoggedIn ? (
                        <>
                            <Link className="nav-link" to="/app/profile">Hi, {userName}</Link>
                            <button className="btn btn-outline-danger" onClick={logout}>Log out</button>
                        </>
                    ) : (
                        <>
                            <Link className="btn btn-outline-primary" to="/app/login">Log in</Link>
                            <Link className="btn btn-primary" to="/app/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

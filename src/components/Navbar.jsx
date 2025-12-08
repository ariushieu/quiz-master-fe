import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../services/api';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [avatar, setAvatar] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (user) {
            loadAvatar();
        }
    }, [user]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadAvatar = async () => {
        try {
            const data = await statsAPI.getMyStats();
            setAvatar(data.avatar);
        } catch (error) {
            console.error('Failed to load avatar');
        }
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        logout();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Quiz<span>Master</span>
            </Link>

            <ul className="navbar-nav">
                {user ? (
                    <>
                        <li><Link to="/sets">My Sets</Link></li>
                        <li><Link to="/create">Create</Link></li>
                        <li><Link to="/leaderboard">Top Streak</Link></li>

                        {/* Avatar Dropdown */}
                        <li className="nav-dropdown" ref={dropdownRef}>
                            <button
                                className="nav-avatar-btn"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                {avatar ? (
                                    <img src={avatar} alt={user.username} className="nav-avatar" />
                                ) : (
                                    <div className="nav-avatar nav-avatar-placeholder">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        {user.username}
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="dropdown-item"
                                        onClick={() => setDropdownOpen(false)}
                                    >
                                        👤 Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="dropdown-item dropdown-item-danger"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    </>
                ) : (
                    <>
                        <li><a href="/#features">Features</a></li>
                        <li><a href="/#about">About</a></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

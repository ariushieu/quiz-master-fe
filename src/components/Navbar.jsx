import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../services/api';
import MobileMenu from './MobileMenu';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [avatar, setAvatar] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        setMobileMenuOpen(false);
        logout();
    };

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    Quiz<span>Master</span>
                </Link>

                {/* Mobile Toggler */}
                <button
                    className="navbar-toggler"
                    onClick={() => setMobileMenuOpen(prev => !prev)}
                    aria-label="Toggle navigation"
                >
                    ☰
                </button>

                <ul className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            {/* Desktop Navigation Links */}
                            <li className="desktop-only"><Link to="/sets">My Sets</Link></li>
                            <li className="desktop-only"><Link to="/explore">Explore</Link></li>
                            <li className="desktop-only"><Link to="/create">Create</Link></li>
                            <li className="desktop-only"><Link to="/reading">Reading</Link></li>
                            <li className="desktop-only"><Link to="/leaderboard">Leaderboard</Link></li>

                            {/* Desktop Avatar Dropdown */}
                            <li className="nav-dropdown desktop-only" ref={dropdownRef}>
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
                                            {user.role === 'admin' && <span className="admin-tag">Admin</span>}
                                        </div>
                                        <Link
                                            to="/profile"
                                            className="dropdown-item"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            👤 Profile
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="dropdown-item"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                🛡️ Admin
                                            </Link>
                                        )}
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

            {/* Mobile Menu Overlay */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                user={user}
                avatar={avatar}
                onLogout={handleLogout}
            />
        </>
    );
}


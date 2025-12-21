import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../services/api';

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
        logout();
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Quiz<span>Master</span>
            </Link>

            {/* Mobile Toggler */}
            <button
                className="navbar-toggler"
                onClick={() => setMobileMenuOpen(prev => !prev)} // Re-using dropdown logic or better: separate state
                aria-label="Toggle navigation"
            >
                ☰
            </button>

            {/* We need a separate state for mobile menu, let's just use a new one */}
            {/* Note: In the actual implementation below I'll add the state */}

            <ul className={`navbar-nav ${mobileMenuOpen ? 'active' : ''}`}>
                {user ? (
                    <>
                        {/* Mobile: Show User Info at top */}
                        <li className="mobile-only-user-info">
                            <div className="nav-avatar-placeholder" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.username}</span>
                        </li>

                        <li><Link to="/sets" onClick={() => setMobileMenuOpen(false)}>My Sets</Link></li>
                        <li><Link to="/explore" onClick={() => setMobileMenuOpen(false)}>Explore</Link></li>
                        <li><Link to="/create" onClick={() => setMobileMenuOpen(false)}>Create</Link></li>
                        <li><Link to="/reading" onClick={() => setMobileMenuOpen(false)}>Reading</Link></li>
                        <li><Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>Top Streak</Link></li>

                        {/* Desktop Avatar Dropdown (Hidden on Mobile) */}
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

                        {/* Mobile: Profile/Logout Links */}
                        <li className="mobile-only"><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link></li>
                        {user.role === 'admin' && (
                            <li className="mobile-only"><Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link></li>
                        )}
                        <li className="mobile-only">
                            <button onClick={handleLogout} className="text-error" style={{ background: 'none', border: 'none', color: 'var(--error)', fontSize: '1rem', fontWeight: 500, padding: 0, cursor: 'pointer' }}>
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><a href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</a></li>
                        <li><a href="/#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
                        <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link></li>
                        <li><Link to="/register" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

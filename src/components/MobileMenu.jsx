import { Link } from 'react-router-dom';

export default function MobileMenu({ isOpen, onClose, user, avatar, onLogout }) {
    if (!isOpen) return null;

    const handleLinkClick = () => {
        onClose();
    };

    const handleLogout = () => {
        onClose();
        onLogout();
    };

    return (
        <>
            {/* Overlay backdrop */}
            <div className="mobile-menu-overlay" onClick={onClose} />

            {/* Menu panel */}
            <div className="mobile-menu">
                {/* User Profile Section - only when logged in */}
                {user && (
                    <div className="mobile-menu-profile">
                        {avatar ? (
                            <img src={avatar} alt={user.username} className="mobile-menu-avatar" />
                        ) : (
                            <div className="mobile-menu-avatar mobile-menu-avatar-placeholder">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="mobile-menu-user-info">
                            <span className="mobile-menu-username">{user.username}</span>
                            {user.role === 'admin' && <span className="mobile-menu-admin-tag">Admin</span>}
                        </div>
                    </div>
                )}

                {/* Navigation Items */}
                <nav className="mobile-menu-nav">
                    {user ? (
                        <>
                            {/* Logged in menu items */}
                            <Link to="/sets" className="mobile-menu-item" onClick={handleLinkClick}>
                                My Sets
                            </Link>
                            <Link to="/explore" className="mobile-menu-item" onClick={handleLinkClick}>
                                Explore
                            </Link>
                            <Link to="/create" className="mobile-menu-item" onClick={handleLinkClick}>
                                Create
                            </Link>
                            <Link to="/reading" className="mobile-menu-item" onClick={handleLinkClick}>
                                Reading
                            </Link>
                            <Link to="/leaderboard" className="mobile-menu-item" onClick={handleLinkClick}>
                                Leaderboard
                            </Link>
                            <Link to="/profile" className="mobile-menu-item" onClick={handleLinkClick}>
                                Profile
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="mobile-menu-item" onClick={handleLinkClick}>
                                    Admin Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Not logged in menu items */}
                            <a href="/#features" className="mobile-menu-item" onClick={handleLinkClick}>
                                Features
                            </a>
                            <a href="/#about" className="mobile-menu-item" onClick={handleLinkClick}>
                                About
                            </a>
                            <Link to="/login" className="mobile-menu-item" onClick={handleLinkClick}>
                                Login
                            </Link>
                            <Link to="/register" className="mobile-menu-item" onClick={handleLinkClick}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>

                {/* Logout Button - only when logged in */}
                {user && (
                    <div className="mobile-menu-footer">
                        <button className="mobile-menu-logout" onClick={handleLogout}>
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

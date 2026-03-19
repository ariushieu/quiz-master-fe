import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { statsAPI } from '../../services/api';

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 01-3.46 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const loadAvatar = async () => {
      try {
        const data = await statsAPI.getMyStats();
        setAvatar(data.avatar || null);
      } catch {
        setAvatar(null);
      }
    };
    loadAvatar();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">
          <Link to="/" className="topbar-brand-link" aria-label="QuizMaster home">
            Quiz<span>Master</span>
          </Link>
        </div>

        {user ? (
          <>
            <div className="topbar-search">
              <span className="topbar-search-icon" aria-hidden="true">
                <SearchIcon />
              </span>
              <input
                className="topbar-search-input"
                placeholder="Search here"
                aria-label="Search"
              />
            </div>

            <div className="topbar-right">
              <div className="topbar-notifications" aria-label="Notifications">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Open notifications"
                >
                  <BellIcon />
                </button>
                <span className="notification-dot" aria-hidden="true" />
              </div>

              <div className="topbar-divider" />

              <div className="topbar-user" ref={dropdownRef}>
                <button
                  type="button"
                  className="user-dropdown-button"
                  aria-label="User menu"
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  {avatar ? (
                    <img src={avatar} alt={user.username} className="user-avatar" />
                  ) : (
                    <div className="user-avatar user-avatar-placeholder" aria-hidden="true">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="topbar-user-meta">
                    <div className="topbar-user-name">{user.username}</div>
                    <div className="topbar-user-role">
                      {user.role === 'admin' ? 'Admin' : 'Member'}
                    </div>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      {user.username}
                      {user.role === 'admin' && <span className="admin-tag">Admin</span>}
                    </div>
                    <Link
                      className="user-dropdown-item"
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        className="user-dropdown-item"
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🛡️ Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="user-dropdown-item user-dropdown-item-danger"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="topbar-guest">
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}


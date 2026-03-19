import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function SidebarNavItem({ to, label, icon, isActive }) {
  return (
    <Link
      to={to}
      className="sidebar-nav-item"
      data-active={isActive ? 'true' : 'false'}
    >
      <span className="sidebar-nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="sidebar-nav-label">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const items = [
    { to: '/sets', label: 'My Sets', icon: '📚', roles: ['user', 'admin'] },
    { to: '/explore', label: 'Explore', icon: '🌍', roles: ['user', 'admin'] },
    { to: '/create', label: 'Create', icon: '✨', roles: ['user', 'admin'] },
    { to: '/reading', label: 'Reading', icon: '📰', roles: ['user', 'admin'] },
    { to: '/grammar', label: 'Grammar', icon: '🧩', roles: ['user', 'admin'] },
    { to: '/leaderboard', label: 'Leaderboard', icon: '🏆', roles: ['user', 'admin'] },
    { to: '/profile', label: 'Profile', icon: '👤', roles: ['user', 'admin'] },
    { to: '/admin', label: 'Admin Dashboard', icon: '🛡️', roles: ['admin'] },
  ];

  const allowedItems = items.filter((i) => i.roles.includes(user?.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark" aria-hidden="true">
          ✦
        </div>
        <div className="sidebar-logo-text">
          Quiz<span>Master</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {allowedItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(`${item.to}/`));
          return (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              isActive={isActive}
            />
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-bottom-item"
          data-active="false"
          onClick={() => {
            // UI-only placeholder for future settings route
            window.alert('Tính năng đang phát triển');
          }}
        >
          <span className="sidebar-nav-icon" aria-hidden="true">
            ⚙️
          </span>
          <span className="sidebar-nav-label">Settings</span>
        </button>
        <button
          type="button"
          className="sidebar-bottom-item"
          data-active="false"
          onClick={() => {
            window.alert('Tính năng đang phát triển');
          }}
        >
          <span className="sidebar-nav-icon" aria-hidden="true">
            ❓
          </span>
          <span className="sidebar-nav-label">Help</span>
        </button>
      </div>
    </aside>
  );
}


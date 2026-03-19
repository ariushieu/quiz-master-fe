import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();

  return (
    <div className={`dashboard-shell ${user ? 'has-sidebar' : ''}`}>
      <div className="dashboard-topbar">
        <Topbar />
      </div>

      {user ? (
        <div className="dashboard-sidebar">
          <Sidebar />
        </div>
      ) : null}

      <div className="dashboard-content">{children}</div>
    </div>
  );
}


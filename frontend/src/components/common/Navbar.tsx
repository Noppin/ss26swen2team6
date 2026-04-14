import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: '#1e3a5f', color: '#fff', padding: '0 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56
    }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>
        Tour Planner
      </Link>
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14 }}>Hello, {user.username}</span>
          <button
            onClick={handleLogout}
            style={{ background: '#dc2626', color: '#fff', padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13 }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

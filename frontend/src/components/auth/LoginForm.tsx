import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required.'); return; }
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      login(res.accessToken, { userId: res.userId, username: res.username, email: res.email });
      navigate('/');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" style={{ maxWidth: 380, margin: '60px auto' }}>
      <div className="card flex flex-col gap-4">
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Sign In</h2>
        <div>
          <label className="label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
          No account? <Link to="/register" style={{ color: '#2563eb' }}>Register</Link>
        </p>
      </div>
    </form>
  );
}

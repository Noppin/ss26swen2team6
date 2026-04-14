import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, color: '#1e3a5f' }}>404</h1>
      <p style={{ color: '#6b7280', marginTop: 8, marginBottom: 24 }}>Page not found.</p>
      <Link to="/" style={{ color: '#2563eb' }}>Go to Tours</Link>
    </div>
  );
}

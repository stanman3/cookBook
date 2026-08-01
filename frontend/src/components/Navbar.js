import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow)',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.5rem' }}>🍳</span>
        <span style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--primary)',
        }}>CookBook</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/recipes" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '0.9rem' }}>
          Recipes
        </Link>
        {isLoggedIn && (
          <>
            <Link to="/favorites" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '0.9rem' }}>
              Favorites
            </Link>
            <Link to="/meal-plans" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '0.9rem' }}>
              Meal Plans
            </Link>
            <Link to="/recipes/new" style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}>
              + Add Recipe
            </Link>
            <button onClick={handleLogout} style={{
              background: 'none',
              color: 'var(--muted)',
              fontWeight: 500,
              fontSize: '0.9rem',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border)',
            }}>
              Logout
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link to="/login" style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" style={{
              background: 'var(--primary)',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

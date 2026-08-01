import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isLoggedIn } = useAuth();

  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 60%, #52B788 100%)',
        color: '#fff',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B7E4C7', marginBottom: '1rem' }}>
          Your personal kitchen companion
        </p>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.1 }}>
          Recipes worth<br />coming back to
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#B7E4C7', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Discover, save, and plan meals with recipes from a growing community of home cooks.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/recipes" style={{
            background: '#fff',
            color: 'var(--primary)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}>
            Browse Recipes
          </Link>
          {!isLoggedIn && (
            <Link to="/register" style={{
              background: 'transparent',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.95rem',
              border: '2px solid rgba(255,255,255,0.4)',
            }}>
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '📖', title: 'Discover Recipes', desc: 'Browse a curated collection of recipes with difficulty levels and cooking times.' },
            { icon: '❤️', title: 'Save Favorites', desc: 'Build your personal collection of go-to recipes for quick access anytime.' },
            { icon: '📅', title: 'Plan Your Week', desc: 'Organize meals day by day so you always know what\'s for dinner.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow)',
              borderTop: '3px solid var(--primary-light)',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

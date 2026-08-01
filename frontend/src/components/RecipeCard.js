import { Link } from 'react-router-dom';

const difficultyColor = {
  EASY: { bg: '#D8F3DC', text: '#2D6A4F' },
  MEDIUM: { bg: '#FEF3C7', text: '#92400E' },
  HARD: { bg: '#FEE2E2', text: '#991B1B' },
};

export default function RecipeCard({ recipe }) {
  const diff = difficultyColor[recipe.difficulty] || difficultyColor.EASY;

  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderLeft: '4px solid var(--primary)',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow)';
        }}
      >
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
          />
        )}
        {!recipe.imageUrl && (
          <div style={{
            width: '100%', height: '180px',
            background: 'var(--primary-xlight)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem',
          }}>🍽️</div>
        )}
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', flex: 1 }}>
              {recipe.title}
            </h3>
            <span style={{
              background: diff.bg,
              color: diff.text,
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '20px',
              marginLeft: '8px',
              whiteSpace: 'nowrap',
            }}>
              {recipe.difficulty}
            </span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
            {recipe.description?.slice(0, 80)}{recipe.description?.length > 80 ? '...' : ''}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--muted)', fontSize: '0.8rem' }}>
            <span>⏱</span>
            <span>{recipe.cookingTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

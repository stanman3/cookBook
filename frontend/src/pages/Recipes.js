import { useState, useEffect, useMemo } from 'react';
import { getRecipes } from '../services/api';
import RecipeCard from '../components/RecipeCard';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('ALL');
  const [maxTime, setMaxTime] = useState('');

  useEffect(() => {
    getRecipes().then(data => {
      setRecipes(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase());
      const matchDifficulty = difficulty === 'ALL' || r.difficulty === difficulty;
      const matchTime = !maxTime || r.cookingTime <= parseInt(maxTime);
      return matchSearch && matchDifficulty && matchTime;
    });
  }, [recipes, search, difficulty, maxTime]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>All Recipes</h1>
        <p style={{ color: 'var(--muted)' }}>{filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Filters */}
      <div style={{
        background: 'var(--surface)',
        borderRadius: 'var(--radius)',
        padding: '1.25rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: '1', minWidth: '200px', padding: '9px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
          }}
        />
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          style={{
            padding: '9px 14px', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
            background: '#fff', color: 'var(--text)',
          }}
        >
          <option value="ALL">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Max time (min)"
          value={maxTime}
          onChange={e => setMaxTime(e.target.value)}
          style={{
            width: '150px', padding: '9px 14px',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
            fontSize: '0.9rem',
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Loading recipes...</div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No recipes match your filters.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>
    </div>
  );
}

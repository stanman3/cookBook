import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe, updateRecipe } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipeEdit() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', cookingTime: '', difficulty: 'EASY', imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getRecipe(id).then(r => {
      setForm({
        title: r.title || '',
        description: r.description || '',
        cookingTime: r.cookingTime || '',
        difficulty: r.difficulty || 'EASY',
        imageUrl: r.imageUrl || '',
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await updateRecipe(id, { ...form, cookingTime: parseInt(form.cookingTime) }, token);
      if (data.id) navigate(`/recipes/${id}`);
      else setError('Failed to update recipe.');
    } catch {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Edit Recipe</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Update your recipe</p>

      {error && (
        <div style={{ background: '#FEE2E2', color: 'var(--error)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '2rem', boxShadow: 'var(--shadow)' }}>
        <form onSubmit={handleSubmit}>
          {[
            { key: 'title', label: 'Title', type: 'text', placeholder: 'e.g. Creamy Pasta Carbonara' },
            { key: 'imageUrl', label: 'Image URL (optional)', type: 'url', placeholder: 'https://...' },
            { key: 'cookingTime', label: 'Cooking Time (minutes)', type: 'number', placeholder: '30' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                required={key !== 'imageUrl'}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          ))}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>Difficulty</label>
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem',
                background: '#fff',
              }}
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px' }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe your recipe..."
              rows={5}
              required
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem',
                resize: 'vertical', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={() => navigate(`/recipes/${id}`)} style={{
              flex: 1, padding: '12px',
              background: 'none', color: 'var(--muted)',
              borderRadius: 'var(--radius-sm)', fontWeight: 600,
              border: '1px solid var(--border)',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '12px',
              background: loading ? 'var(--muted)' : 'var(--primary)',
              color: '#fff', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.95rem',
            }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
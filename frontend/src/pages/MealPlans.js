import { useState, useEffect } from 'react';
import { getMealPlans, getRecipe, deleteMealPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function MealPlans() {
  const { token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMealPlans(token).then(async (data) => {
      if (!Array.isArray(data)) { setLoading(false); return; }
      const enriched = await Promise.all(data.map(async (p) => {
        const recipe = await getRecipe(p.recipeId);
        return { ...p, recipe };
      }));
      setPlans(enriched.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setLoading(false);
    });
  }, [token]);

  const handleDelete = async (id) => {
    await deleteMealPlan(id, token);
    setPlans(plans.filter(p => p.id !== id));
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Meal Plans</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Your upcoming meals</p>

      {loading && <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Loading...</div>}

      {!loading && plans.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <p>No meal plans yet. Open a recipe and add it to your plan!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {plans.map(plan => (
          <div key={plan.id} style={{
            background: 'var(--surface)', borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)', padding: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '1.25rem',
            borderLeft: '4px solid var(--primary)',
          }}>
            <div style={{
              background: 'var(--primary-xlight)', color: 'var(--primary)',
              borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.75rem',
              textAlign: 'center', minWidth: '70px',
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {formatDate(plan.date).split(' ')[0]}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>
                {new Date(plan.date).getDate()}
              </div>
              <div style={{ fontSize: '0.75rem' }}>
                {formatDate(plan.date).split(' ').slice(2).join(' ')}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Link to={`/recipes/${plan.recipeId}`} style={{ fontWeight: 600, color: 'var(--text)', fontSize: '1rem' }}>
                {plan.recipe?.title || 'Recipe'}
              </Link>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                {plan.recipe?.cookingTime} min · {plan.recipe?.difficulty}
              </div>
            </div>
            <button onClick={() => handleDelete(plan.id)} style={{
              background: 'none', color: 'var(--muted)',
              fontSize: '1.1rem', padding: '4px 8px',
              borderRadius: 'var(--radius-sm)',
            }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

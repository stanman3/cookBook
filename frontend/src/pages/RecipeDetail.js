import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, getComments, addComment, deleteComment, addFavorite, removeFavorite, getFavorites, deleteMealPlan, addMealPlan } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetail() {
  const { id } = useParams();
  const { token, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mealDate, setMealDate] = useState('');

  useEffect(() => {
    Promise.all([
      getRecipe(id),
      getComments(id),
      isLoggedIn ? getFavorites(token) : Promise.resolve([]),
    ]).then(([r, c, favs]) => {
      setRecipe(r);
      setComments(Array.isArray(c) ? c : []);
      setIsFavorite(Array.isArray(favs) && favs.some(f => f.recipeId === parseInt(id)));
      setLoading(false);
    });
  }, [id, token, isLoggedIn]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) return navigate('/login');
    if (isFavorite) {
      await removeFavorite(id, token);
      setIsFavorite(false);
    } else {
      await addFavorite(parseInt(id), token);
      setIsFavorite(true);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const c = await addComment(id, newComment, token);
    setComments([...comments, c]);
    setNewComment('');
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment(id, commentId, token);
    setComments(comments.filter(c => c.id !== commentId));
  };

  const handleAddToMealPlan = async () => {
    if (!mealDate) return;
    await addMealPlan({ recipeId: parseInt(id), date: new Date(mealDate).toISOString() }, token);
    alert('Added to meal plan!');
    setMealDate('');
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Loading...</div>;
  if (!recipe) return <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>Recipe not found.</div>;

  const diffColor = { EASY: '#2D6A4F', MEDIUM: '#92400E', HARD: '#991B1B' };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        {recipe.imageUrl && (
          <img src={recipe.imageUrl} alt={recipe.title}
            style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }} />
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{recipe.title}</h1>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--muted)', fontSize: '0.9rem' }}>
              <span>⏱ {recipe.cookingTime} min</span>
              <span style={{ color: diffColor[recipe.difficulty], fontWeight: 600 }}>{recipe.difficulty}</span>
            </div>
          </div>
          {isLoggedIn && (
            <button onClick={handleToggleFavorite} style={{
              background: isFavorite ? '#FEE2E2' : 'var(--primary-xlight)',
              color: isFavorite ? '#991B1B' : 'var(--primary)',
              padding: '10px 20px', borderRadius: 'var(--radius-sm)',
              fontWeight: 600, fontSize: '0.9rem',
            }}>
              {isFavorite ? '❤️ Saved' : '🤍 Save'}
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About this recipe</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8 }}>{recipe.description}</p>
      </div>

      {/* Add to Meal Plan */}
      {isLoggedIn && (
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Add to Meal Plan</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input type="date" value={mealDate} onChange={e => setMealDate(e.target.value)}
              style={{ padding: '9px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', flex: 1 }} />
            <button onClick={handleAddToMealPlan} style={{
              background: 'var(--primary)', color: '#fff',
              padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600,
            }}>
              Add
            </button>
          </div>
        </div>
      )}

      {/* Comments */}
      <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Comments ({comments.length})</h2>

        {isLoggedIn && (
          <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                flex: 1, padding: '10px 14px',
                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem',
              }}
            />
            <button type="submit" style={{
              background: 'var(--primary)', color: '#fff',
              padding: '10px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 600,
            }}>Post</button>
          </form>
        )}

        {comments.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No comments yet. Be the first!</p>
        )}

        {comments.map(c => (
          <div key={c.id} style={{
            padding: '1rem', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg)', marginBottom: '0.75rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text)' }}>{c.content}</p>
            {isLoggedIn && (
              <button onClick={() => handleDeleteComment(c.id)} style={{
                background: 'none', color: 'var(--muted)', fontSize: '0.8rem', padding: '2px 6px',
              }}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

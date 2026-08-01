import { useState, useEffect } from 'react';
import { getFavorites, getRecipe, removeFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

export default function Favorites() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites(token).then(async (favs) => {
      if (!Array.isArray(favs)) { setLoading(false); return; }
      const details = await Promise.all(favs.map(f => getRecipe(f.recipeId)));
      setRecipes(details.filter(r => r && r.id));
      setLoading(false);
    });
  }, [token]);

  const handleRemove = async (recipeId) => {
    await removeFavorite(recipeId, token);
    setRecipes(recipes.filter(r => r.id !== recipeId));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Saved Recipes</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>{recipes.length} saved recipe{recipes.length !== 1 ? 's' : ''}</p>

      {loading && <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>Loading...</div>}

      {!loading && recipes.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
          <p>No saved recipes yet. Browse recipes and save your favorites!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {recipes.map(recipe => (
          <div key={recipe.id} style={{ position: 'relative' }}>
            <RecipeCard recipe={recipe} />
            <button onClick={() => handleRemove(recipe.id)} style={{
              position: 'absolute', top: '8px', right: '8px',
              background: '#FEE2E2', color: '#991B1B',
              padding: '4px 10px', borderRadius: '20px',
              fontSize: '0.75rem', fontWeight: 600,
            }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

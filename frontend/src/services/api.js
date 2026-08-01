const BASE_URL = 'http://localhost:8000';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

// Auth
export const register = (data) =>
  fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(r => r.json());

export const login = (username, password) => {
  const form = new URLSearchParams();
  form.append('username', username);
  form.append('password', password);
  return fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    body: form,
  }).then(r => r.json());
};

// Recipes
export const getRecipes = () =>
  fetch(`${BASE_URL}/recipes/`).then(r => r.json());

export const getRecipe = (id) =>
  fetch(`${BASE_URL}/recipes/${id}`).then(r => r.json());

export const createRecipe = (data, token) =>
  fetch(`${BASE_URL}/recipes/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const updateRecipe = (id, data, token) =>
  fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteRecipe = (id, token) =>
  fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  }).then(r => r.json());

// Comments
export const getComments = (recipeId) =>
  fetch(`${BASE_URL}/recipes/${recipeId}/comments/`).then(r => r.json());

export const addComment = (recipeId, content, token) =>
  fetch(`${BASE_URL}/recipes/${recipeId}/comments/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ content }),
  }).then(r => r.json());

export const deleteComment = (recipeId, commentId, token) =>
  fetch(`${BASE_URL}/recipes/${recipeId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  }).then(r => r.json());

// Favorites
export const getFavorites = (token) =>
  fetch(`${BASE_URL}/favoriterecipes/`, {
    headers: getHeaders(token),
  }).then(r => r.json());

export const addFavorite = (recipeId, token) =>
  fetch(`${BASE_URL}/favoriterecipes/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ recipeId }),
  }).then(r => r.json());

export const removeFavorite = (recipeId, token) =>
  fetch(`${BASE_URL}/favoriterecipes/${recipeId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  }).then(r => r.json());

// Meal Plans
export const getMealPlans = (token) =>
  fetch(`${BASE_URL}/mealplans/`, {
    headers: getHeaders(token),
  }).then(r => r.json());

export const addMealPlan = (data, token) =>
  fetch(`${BASE_URL}/mealplans/`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(data),
  }).then(r => r.json());

export const deleteMealPlan = (id, token) =>
  fetch(`${BASE_URL}/mealplans/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  }).then(r => r.json());

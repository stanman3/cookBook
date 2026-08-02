import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = async (newToken) => {
    setToken(newToken);
    const res = await fetch('http://localhost:8000/users/me/', {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    const userData = await res.json();
    setUser(userData);
  };

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8000/users/me/', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()).then(setUser).catch(() => setToken(null));
    }
  }, []);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

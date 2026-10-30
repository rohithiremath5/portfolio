import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);
const STORAGE_KEY = 'portfolio-theme';
function initialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* Fall back to system preference if storage is unavailable. */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
export function ThemeProvider({ children }) {
  // Match build-time markup first; the head script applies the palette before paint.
  const [theme, setTheme] = useState('light');
  const [preference, setPreference] = useState(false);
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setTheme(initialTheme());
    try { setPreference(['light', 'dark'].includes(localStorage.getItem(STORAGE_KEY))); }
    catch { /* Follow the system when storage is unavailable. */ }
    setInitialized(true);
  }, []);
  useEffect(() => {
    if (!initialized) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, initialized]);
  useEffect(() => {
    if (!initialized || preference) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = (event) => setTheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, [preference, initialized]);
  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setPreference(true);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Retain the in-memory choice. */ }
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}
export function useThemeState() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('Theme hooks must be used inside ThemeProvider');
  return context;
}
export const useThemeActions = useThemeState;

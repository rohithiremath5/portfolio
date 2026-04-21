// ============================================================
// THEME CONTEXT — Demonstrates Context API + useReducer pattern
// ============================================================

import { createContext, useContext, useReducer, useCallback } from 'react';

// 1. Define action types as constants (prevents typos)
const ACTIONS = {
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_ACCENT: 'SET_ACCENT',
  TOGGLE_REDUCED_MOTION: 'TOGGLE_REDUCED_MOTION',
};

// 2. Initial state shape
const initialState = {
  theme: 'dark',
  accent: '#00ff87',
  reducedMotion: false,
};

// 3. Pure reducer function — no side effects, predictable
function themeReducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_THEME:
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case ACTIONS.SET_ACCENT:
      return { ...state, accent: action.payload };
    case ACTIONS.TOGGLE_REDUCED_MOTION:
      return { ...state, reducedMotion: !state.reducedMotion };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

// 4. Create context (split state and dispatch for performance)
const ThemeStateContext = createContext(null);
const ThemeDispatchContext = createContext(null);

// 5. Provider component
export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

// 6. Custom hooks that encapsulate context consumption
export function useThemeState() {
  const ctx = useContext(ThemeStateContext);
  if (!ctx) throw new Error('useThemeState must be inside ThemeProvider');
  return ctx;
}

// 7. Action creators wrapped in useCallback for stability
export function useThemeActions() {
  const dispatch = useContext(ThemeDispatchContext);
  if (!dispatch) throw new Error('useThemeActions must be inside ThemeProvider');

  const toggleTheme = useCallback(
    () => dispatch({ type: ACTIONS.TOGGLE_THEME }),
    [dispatch]
  );

  const setAccent = useCallback(
    (color) => dispatch({ type: ACTIONS.SET_ACCENT, payload: color }),
    [dispatch]
  );

  const toggleReducedMotion = useCallback(
    () => dispatch({ type: ACTIONS.TOGGLE_REDUCED_MOTION }),
    [dispatch]
  );

  return { toggleTheme, setAccent, toggleReducedMotion };
}

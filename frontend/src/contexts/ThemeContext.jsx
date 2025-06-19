// src/contexts/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // 1) read saved theme (or default to 'light')
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  // 2) whenever theme changes, update <html> class & localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 3) toggle function
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook to consume
export function useTheme() {
  return useContext(ThemeContext);
}

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  //read saved theme (or default to 'light')
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  //whenever theme changes, update <html> class & localStorage
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  //toggle function
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

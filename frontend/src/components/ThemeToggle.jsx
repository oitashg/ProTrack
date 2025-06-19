import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';  // or any icon set

// ThemeToggle component to switch between light and dark themes
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full focus:outline-none bg-gray-200 dark:bg-gray-700"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Palette } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();

  return (
    <div className="theme-selector">
      <Palette size={18} className="theme-icon" />
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
        className="theme-select"
      >
        {themes.map(t => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('admin-theme');
    return saved || 'dark';
  });

  const [accentColor, setAccentColor] = useState(() => {
    const saved = localStorage.getItem('admin-accent');
    return saved || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', mode);
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    return () => {
      root.classList.add('dark');
    };
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('admin-accent', accentColor);
    const root = document.documentElement;
    const colors = accentColors[accentColor] || accentColors.indigo;
    root.style.setProperty('--admin-primary', colors.primary);
    root.style.setProperty('--admin-primary-hover', colors.hover);
    root.style.setProperty('--admin-primary-soft', colors.soft);
  }, [accentColor]);

  const toggleMode = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  const accentColors = {
    indigo: { primary: '#6366f1', hover: '#4f46e5', soft: 'rgba(99,102,241,0.1)' },
    blue: { primary: '#3b82f6', hover: '#2563eb', soft: 'rgba(59,130,246,0.1)' },
    emerald: { primary: '#10b981', hover: '#059669', soft: 'rgba(16,185,129,0.1)' },
    amber: { primary: '#f59e0b', hover: '#d97706', soft: 'rgba(245,158,11,0.1)' },
    rose: { primary: '#f43f5e', hover: '#e11d48', soft: 'rgba(244,63,94,0.1)' },
  };

  return (
    <ThemeContext.Provider value={{
      mode,
      setMode,
      toggleMode,
      accentColor,
      setAccentColor,
      accent: accentColors[accentColor] || accentColors.indigo,
      accentColors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

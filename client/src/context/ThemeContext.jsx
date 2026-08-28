import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark';
  });

  useEffect(() => {
    // Apply the theme to the document element
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    // Save to local storage
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'dark') return 'evil';
      if (prev === 'evil') return 'light';
      return 'dark';
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders of all consumers
  const value = useMemo(() => ({ theme, cycleTheme }), [theme, cycleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

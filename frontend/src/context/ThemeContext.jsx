import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
    { name: 'Indigo', color: '#6366F1', hover: '#4F46E5', light: '#EEF2FF', darkLight: 'rgba(99,102,241,0.15)' },
    { name: 'Violet', color: '#8B5CF6', hover: '#7C3AED', light: '#F5F3FF', darkLight: 'rgba(139,92,246,0.15)' },
    { name: 'Rose', color: '#F43F5E', hover: '#E11D48', light: '#FFF1F2', darkLight: 'rgba(244,63,94,0.15)' },
    { name: 'Cyan', color: '#06B6D4', hover: '#0891B2', light: '#ECFEFF', darkLight: 'rgba(6,182,212,0.15)' },
    { name: 'Emerald', color: '#10B981', hover: '#059669', light: '#ECFDF5', darkLight: 'rgba(16,185,129,0.15)' },
    { name: 'Amber', color: '#F59E0B', hover: '#D97706', light: '#FFFBEB', darkLight: 'rgba(245,158,11,0.15)' },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [currentTheme, setCurrentThemeState] = useState(() => {
        const saved = localStorage.getItem('skillbuddy-theme');
        if (saved) {
            const found = THEMES.find(t => t.name === saved);
            if (found) return found;
        }
        return THEMES[0];
    });

    const [darkMode, setDarkModeState] = useState(() => {
        const saved = localStorage.getItem('skillbuddy-dark-mode');
        if (saved !== null) return saved === 'true';
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    });

    const setCurrentTheme = (theme) => {
        setCurrentThemeState(theme);
        localStorage.setItem('skillbuddy-theme', theme.name);
    };

    const toggleDarkMode = () => {
        setDarkModeState(prev => {
            const next = !prev;
            localStorage.setItem('skillbuddy-dark-mode', String(next));
            return next;
        });
    };

    const setDarkMode = (val) => {
        setDarkModeState(val);
        localStorage.setItem('skillbuddy-dark-mode', String(val));
    };

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-theme', currentTheme.color);
        root.style.setProperty('--color-theme-hover', currentTheme.hover);
        root.style.setProperty('--color-theme-light', darkMode ? currentTheme.darkLight : currentTheme.light);

        if (darkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [currentTheme, darkMode]);

    return (
        <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, THEMES, darkMode, toggleDarkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

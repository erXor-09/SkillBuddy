import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/**
 * ThemeToggle — a compact pill that:
 *   • Toggles dark / light mode (sun / moon button)
 *   • Opens a color-swatch popover for accent color selection
 *
 * Usage: <ThemeToggle />
 */
const ThemeToggle = ({ compact = false }) => {
    const { darkMode, toggleDarkMode, currentTheme, setCurrentTheme, THEMES } = useTheme();
    const [showPalette, setShowPalette] = useState(false);
    const paletteRef = useRef(null);

    // Close palette when clicking outside
    useEffect(() => {
        if (!showPalette) return;
        const handler = (e) => {
            if (paletteRef.current && !paletteRef.current.contains(e.target)) {
                setShowPalette(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showPalette]);

    return (
        <div className="relative flex items-center gap-1" ref={paletteRef}>
            {/* Dark / Light toggle */}
            <button
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                    background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                }}
            >
                {darkMode ? (
                    <Sun className="w-4 h-4" style={{ color: '#FCD34D' }} />
                ) : (
                    <Moon className="w-4 h-4" style={{ color: '#6366F1' }} />
                )}
            </button>

            {/* Palette picker toggle */}
            <button
                onClick={() => setShowPalette(v => !v)}
                title="Change accent color"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                    background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                }}
            >
                <Palette className="w-4 h-4" style={{ color: currentTheme.color }} />
            </button>

            {/* Color swatches popover */}
            {showPalette && (
                <div
                    className="absolute right-0 top-10 z-[999] rounded-xl shadow-2xl border p-3"
                    style={{
                        background: darkMode ? '#1A1D27' : '#FFFFFF',
                        borderColor: darkMode ? '#2D3249' : '#E5E7EB',
                        minWidth: '160px',
                    }}
                >
                    <p className="text-xs font-bold uppercase tracking-widest mb-2"
                        style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>
                        Accent Color
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {THEMES.map(theme => (
                            <button
                                key={theme.name}
                                onClick={() => { setCurrentTheme(theme); setShowPalette(false); }}
                                title={theme.name}
                                className="w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center"
                                style={{
                                    backgroundColor: theme.color,
                                    outline: currentTheme.name === theme.name
                                        ? `2px solid ${theme.color}`
                                        : '2px solid transparent',
                                    outlineOffset: '2px',
                                    boxShadow: currentTheme.name === theme.name
                                        ? `0 0 0 4px ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
                                        : 'none',
                                }}
                            >
                                {currentTheme.name === theme.name && (
                                    <span className="block w-2 h-2 rounded-full bg-surface/80" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeToggle;

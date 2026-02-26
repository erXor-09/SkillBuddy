import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, BarChart, BookOpen, Trophy, LogOut, Home, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = ({ onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();
    const { user } = useAuth();
    const { darkMode } = useTheme();
    const isTeacher = user?.role === 'teacher';

    const bg = darkMode ? '#1A1D27' : '#FFFFFF';
    const border = darkMode ? '#2D3249' : '#E5E7EB';
    const borderLight = darkMode ? '#22263A' : '#F3F4F6';
    const textPrimary = darkMode ? '#F1F5F9' : '#111827';
    const textMuted = darkMode ? '#64748B' : '#9CA3AF';
    const hoverBg = darkMode ? 'rgba(255,255,255,0.06)' : '#F9FAFB';

    return (
        <aside
            className={`${isCollapsed ? 'w-20' : 'w-64'} hidden md:flex flex-col transition-all duration-300 h-screen sticky top-0 shadow-sm`}
            style={{ background: bg, borderRight: `1px solid ${border}` }}
        >
            {/* Logo + collapse */}
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${borderLight}` }}>
                {!isCollapsed && (
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Brain className="w-7 h-7 text-theme" />
                        <div>
                            <span className="text-xl font-black tracking-tight" style={{ color: textPrimary }}>SkillBuddy</span>
                            {isTeacher && <span className="block text-xs text-theme font-bold uppercase tracking-wider">Instructor</span>}
                        </div>
                    </Link>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg transition-colors ml-auto"
                    style={{ color: textMuted }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = hoverBg}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 p-4 space-y-1">
                {isTeacher ? (
                    <>
                        <NavItem darkMode={darkMode} icon={Home} label="Overview" to="/dashboard" isActive={location.pathname === '/dashboard'} isCollapsed={isCollapsed} />
                        <NavItem darkMode={darkMode} icon={Users} label="Students" to="/dashboard" isActive={false} isCollapsed={isCollapsed} onClick={() => window.__setTeacherSection?.('students')} />
                        <NavItem darkMode={darkMode} icon={BookOpen} label="Courses" to="/dashboard" isActive={false} isCollapsed={isCollapsed} onClick={() => window.__setTeacherSection?.('courses')} />
                        <NavItem darkMode={darkMode} icon={MessageSquare} label="Doubts" to="/dashboard" isActive={false} isCollapsed={isCollapsed} onClick={() => window.__setTeacherSection?.('doubts')} />
                        <NavItem darkMode={darkMode} icon={BarChart} label="Analytics" to="/dashboard" isActive={false} isCollapsed={isCollapsed} onClick={() => window.__setTeacherSection?.('analytics')} />
                    </>
                ) : (
                    <>
                        <NavItem darkMode={darkMode} icon={Home} label="Dashboard" to="/dashboard" isActive={location.pathname === '/dashboard'} isCollapsed={isCollapsed} />
                        <NavItem darkMode={darkMode} icon={BookOpen} label="My Courses" to="/my-courses" isActive={location.pathname.startsWith('/my-courses') || location.pathname.startsWith('/class/')} isCollapsed={isCollapsed} />
                        <NavItem darkMode={darkMode} icon={MessageSquare} label="Doubt Resolution" to="/doubts" isActive={location.pathname === '/doubts'} isCollapsed={isCollapsed} />
                        <NavItem darkMode={darkMode} icon={BarChart} label="Analytics" to="/analytics" isActive={location.pathname === '/analytics'} isCollapsed={isCollapsed} />
                        <NavItem darkMode={darkMode} icon={Trophy} label="Leaderboard" to="/leaderboard" isActive={location.pathname === '/leaderboard'} isCollapsed={isCollapsed} />
                    </>
                )}
            </nav>

            {/* Theme toggle + logout */}
            <div className="p-4 space-y-2" style={{ borderTop: `1px solid ${borderLight}` }}>
                {!isCollapsed && (
                    <div className="flex items-center justify-between px-2 py-1">
                        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: textMuted }}>Theme</span>
                        <ThemeToggle />
                    </div>
                )}
                {isCollapsed && (
                    <div className="flex justify-center py-1">
                        <ThemeToggle compact />
                    </div>
                )}
                <button
                    onClick={onLogout}
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} w-full px-4 py-3 rounded-lg transition-all duration-200 font-semibold`}
                    style={{ color: textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = textMuted; }}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

const NavItem = ({ icon: Icon, label, to, isCollapsed, isActive, onClick, darkMode }) => {
    const baseClass = `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} w-full py-3 rounded-lg transition-all duration-200 font-semibold text-sm`;

    const activeStyle = { backgroundColor: 'var(--color-theme-light)', color: 'var(--color-theme)' };
    const inactiveStyle = { color: darkMode ? '#94A3B8' : '#6B7280' };

    const content = (
        <>
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">{label}</span>}
        </>
    );

    const props = {
        className: baseClass,
        style: isActive ? activeStyle : inactiveStyle,
        title: isCollapsed ? label : '',
        onClick,
        onMouseEnter: !isActive ? (e => {
            e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.06)' : '#F3F4F6';
            e.currentTarget.style.color = darkMode ? '#F1F5F9' : '#111827';
        }) : undefined,
        onMouseLeave: !isActive ? (e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = darkMode ? '#94A3B8' : '#6B7280';
        }) : undefined,
    };

    if (to) {
        return <Link to={to} {...props}>{content}</Link>;
    }
    return <button {...props}>{content}</button>;
};

export default Sidebar;

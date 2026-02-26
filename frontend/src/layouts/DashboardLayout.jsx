import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const { darkMode } = useTheme();

    return (
        <div
            className={`flex h-screen font-sans overflow-hidden transition-colors duration-200`}
            style={{
                background: darkMode ? '#0F1117' : '#F9FAFB',
                color: darkMode ? '#F1F5F9' : '#111827',
            }}
        >
            <Sidebar onLogout={logout} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;

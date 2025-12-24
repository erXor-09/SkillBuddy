import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, BarChart, Trophy, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, to }) => {
    const content = (
        <>
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </>
    );

    const baseClass = `flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`;

    if (to) {
        return <Link to={to} className={baseClass}>{content}</Link>;
    }

    return <button className={baseClass}>{content}</button>;
};

const StudentSidebar = ({ onLogout }) => {
    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    SkillBuddy
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavItem icon={Home} label="Dashboard" active />
                <NavItem icon={BookOpen} label="My Courses" />
                <NavItem icon={MessageSquare} label="Doubt Resolution" to="/doubts" />
                <NavItem icon={BarChart} label="Analytics" />
                <NavItem icon={Trophy} label="Leaderboard" to="/leaderboard" />
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button onClick={onLogout} className="flex items-center space-x-3 text-gray-400 hover:text-white w-full px-4 py-3 rounded-lg hover:bg-white/5 transition">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;

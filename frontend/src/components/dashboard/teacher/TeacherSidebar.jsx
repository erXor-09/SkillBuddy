import React from 'react';
import { Home, Users, BookOpen, MessageCircle, BarChart, LogOut } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
);

const TeacherSidebar = ({ activeSection, setActiveSection, onLogout }) => {
    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    SkillBuddy
                </h1>
                <span className="text-xs text-purple-400 uppercase tracking-wider font-bold mt-1 block">Instructor</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <NavItem
                    icon={Home}
                    label="Overview"
                    active={activeSection === 'overview'}
                    onClick={() => setActiveSection('overview')}
                />
                <NavItem
                    icon={Users}
                    label="Students"
                    active={activeSection === 'students'}
                    onClick={() => setActiveSection('students')}
                />
                <NavItem
                    icon={BookOpen}
                    label="Courses"
                    active={activeSection === 'courses'}
                    onClick={() => setActiveSection('courses')}
                />
                <NavItem
                    icon={MessageCircle}
                    label="Doubts"
                    active={activeSection === 'doubts'}
                    onClick={() => setActiveSection('doubts')}
                />
                <NavItem
                    icon={BarChart}
                    label="Analytics"
                    active={activeSection === 'analytics'}
                    onClick={() => setActiveSection('analytics')}
                />
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

export default TeacherSidebar;

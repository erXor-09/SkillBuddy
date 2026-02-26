import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Clock, Trophy, ChevronRight, Star, Map, Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RoadmapTree from '../components/RoadmapTree';
import TopicDetailModal from '../components/TopicDetailModal';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const fadeIn = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const StudentDashboard = ({ user, profile, onLogout, fetchProfile }) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const headerBg = darkMode ? '#1A1D27' : '#FFFFFF';
    const headerBorder = darkMode ? '#2D3249' : '#E5E7EB';
    const textColor = darkMode ? '#94A3B8' : '#9CA3AF';

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ background: darkMode ? '#0F1117' : '#F9FAFB' }}>
            {/* Top Header */}
            <header className="h-16 flex items-center justify-between px-8 shrink-0 sticky top-0 z-40" style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}` }}>
                <div className="text-base font-semibold" style={{ color: darkMode ? '#94A3B8' : '#374151' }}>
                    Good morning, <span className="text-theme font-black">{user?.name}</span> 👋
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            title="Profile Menu"
                            className="w-9 h-9 rounded-full bg-theme flex items-center justify-center text-white text-sm font-black overflow-hidden hover:ring-2 hover:ring-theme hover:ring-offset-2 transition-all"
                            style={{ border: `1px solid ${headerBorder}` }}
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name ? user.name[0].toUpperCase() : 'U'
                            )}
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-3 w-48 rounded-xl shadow-xl border py-1 z-50 overflow-hidden"
                                    style={{ background: darkMode ? '#1A1D27' : '#FFFFFF', borderColor: headerBorder }}
                                >
                                    <div className="px-4 py-3 border-b" style={{ borderColor: headerBorder }}>
                                        <p className="text-sm font-bold truncate" style={{ color: darkMode ? '#F1F5F9' : '#111827' }}>{user?.name}</p>
                                        <p className="text-xs truncate" style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-theme-light hover:text-theme transition-colors"
                                        style={{ color: darkMode ? '#E2E8F0' : '#374151' }}
                                    >
                                        <UserIcon className="w-4 h-4" /> Edit Profile
                                    </button>
                                    <button
                                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {selectedTopic && (
                    <TopicDetailModal
                        moduleId={selectedTopic.moduleId}
                        topicId={selectedTopic.topicId}
                        onClose={() => setSelectedTopic(null)}
                        onUpdate={() => { fetchProfile?.(); }}
                    />
                )}

                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <div className="max-w-[1600px] w-full mx-auto space-y-8">

                        {/* Top Highlights Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Current Focus Card */}
                            <motion.div
                                variants={fadeUp}
                                className="md:col-span-8 bg-surface rounded-none p-8 border border-ui-light shadow-sm relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-theme-light rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                                <div className="flex justify-between items-center mb-8 relative z-10">
                                    <h3 className="text-xl font-bold text-primary">Current Focus</h3>
                                    <button onClick={() => navigate('/my-courses')} className="text-theme text-sm font-bold hover:text-theme-hover transition-colors">View all classes →</button>
                                </div>
                                <div className="flex items-center gap-6 bg-page p-5 rounded-none border border-ui-light relative z-10">
                                    <div className="w-16 h-16 rounded-none bg-theme-light flex items-center justify-center border border-theme/20 shadow-inner">
                                        <BookOpen className="w-8 h-8 text-theme" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-theme bg-theme-light px-2.5 py-1 rounded-none">In Progress</span>
                                            <span className="text-xs font-medium text-muted-clr">Next module available now</span>
                                        </div>
                                        <h4 className="text-xl font-black text-primary">{profile?.onboarding?.field || 'Web Development'}</h4>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/my-courses')}
                                        className="w-12 h-12 rounded-full bg-theme hover:bg-theme-hover text-white flex items-center justify-center shadow-lg shrink-0"
                                    >
                                        <Play className="w-5 h-5 ml-0.5" />
                                    </motion.button>
                                </div>
                            </motion.div>

                            {/* Banner Card */}
                            <motion.div
                                variants={fadeUp}
                                className="md:col-span-4 bg-theme rounded-none p-8 text-white relative overflow-hidden shadow-lg flex flex-col justify-center"
                            >
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-surface/10 rounded-full blur-2xl"></div>
                                <div className="relative z-10">
                                    <p className="text-white/80 text-sm font-bold mb-2 uppercase tracking-wider">Don't Forget</p>
                                    <h3 className="text-2xl font-black mb-6 leading-tight">Complete your daily quiz to keep the streak!</h3>
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => navigate('/my-courses')}
                                        className="bg-surface text-theme px-6 py-3 rounded-none font-black text-sm hover:bg-page transition-colors shadow-sm"
                                    >
                                        Go to Quizzes
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Stat Cards */}
                        <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <GlassStatCard title="Hours Studied" value={profile?.stats?.hoursStudied || 0} icon={Clock} iconColor="text-blue-500" iconBg="bg-blue-50" />
                            <GlassStatCard title="Courses Completed" value={profile?.stats?.coursesCompleted || 0} icon={BookOpen} iconColor="text-emerald-500" iconBg="bg-emerald-50" />
                            <GlassStatCard title="Current Streak" value={profile?.streak || 0} unit="Days" icon={Trophy} iconColor="text-amber-500" iconBg="bg-amber-50" />
                            <GlassStatCard title="Total Points" value={profile?.stats?.totalPoints || 0} icon={Star} iconColor="text-theme" iconBg="bg-theme-light" />
                        </motion.div>

                        {/* Learning Roadmap */}
                        <motion.div variants={fadeIn} className="bg-surface rounded-none p-8 md:p-12 border border-ui-light shadow-sm">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-black text-primary tracking-tight flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-none bg-theme-light flex items-center justify-center border border-theme/20">
                                            <Map className="w-6 h-6 text-theme" />
                                        </div>
                                        Your Learning Journey
                                    </h2>
                                    <p className="text-secondary font-medium ml-[3.75rem] mt-1">Track your progress through the generated curriculum.</p>
                                </div>
                            </div>

                            <div className="bg-page rounded-none p-6 border border-ui-light">
                                {profile?.currentPath ? (
                                    <RoadmapTree
                                        modules={profile.currentPath.modules}
                                        onTopicClick={(moduleId, topicId) => setSelectedTopic({ moduleId, topicId })}
                                    />
                                ) : (
                                    <div className="text-center py-20">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                                            className="w-24 h-24 bg-theme-light rounded-full flex items-center justify-center mx-auto mb-6 border border-theme/10"
                                        >
                                            <Trophy className="w-12 h-12 text-theme opacity-40" />
                                        </motion.div>
                                        <h3 className="text-2xl font-black text-primary mb-3">No active path</h3>
                                        <p className="text-secondary font-medium mb-8 max-w-sm mx-auto text-lg">Generate a personalized learning roadmap to start your journey.</p>
                                        <motion.button
                                            whileHover={{ scale: 1.04, y: -2 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => navigate('/onboarding')}
                                            className="bg-theme hover:bg-theme-hover text-white px-8 py-4 rounded-none font-black transition-all shadow-lg inline-flex items-center gap-2"
                                        >
                                            Go to Onboarding <ChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const GlassStatCard = ({ title, value, unit, icon: Icon, iconColor, iconBg }) => (
    <motion.div
        variants={fadeUp}
        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.07)' }}
        className="bg-surface p-6 rounded-none border border-ui-light shadow-sm cursor-default transition-all duration-300"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-none ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
        </div>
        <p className="text-xs font-bold text-muted-clr uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-black text-primary tracking-tight">{value}</h3>
            {unit && <span className="text-sm font-bold text-muted-clr">{unit}</span>}
        </div>
    </motion.div>
);

export default StudentDashboard;

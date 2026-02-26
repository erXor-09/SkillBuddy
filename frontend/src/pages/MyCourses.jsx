import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Loader, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const MyCourses = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ai-path');
    const [aiProfile, setAiProfile] = useState(null);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [profileRes, classesRes] = await Promise.all([
                api.get('/courses/dashboard'),
                api.get('/courses/student/enrolled-classes')
            ]);
            setAiProfile(profileRes.data.profile);
            setEnrolledClasses(classesRes.data.classes);
        } catch { console.error('Error fetching courses'); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className="min-h-screen bg-page flex items-center justify-center">
            <Loader className="w-12 h-12 text-theme animate-spin" />
        </div>
    );

    const hasAIPath = aiProfile?.currentPath;
    const getAIProgress = () => {
        if (!hasAIPath) return 0;
        const modules = aiProfile.currentPath.modules || [];
        const total = modules.reduce((a, m) => a + (m.topics || []).length, 0);
        const done = modules.reduce((a, m) => a + (m.topics || []).filter(t => t.status === 'completed').length, 0);
        return total > 0 ? (done / total) * 100 : 0;
    };
    const aiProgress = getAIProgress();

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-page font-sans">
            <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-ui px-8 py-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-primary mb-0.5">My Learning</h1>
                        <p className="text-secondary font-medium">Manage your personalized path and enrolled classes.</p>
                    </div>
                    <div className="flex bg-surface-2 p-1 rounded-none">
                        {[{ key: 'ai-path', label: 'AI Learning Path' }, { key: 'classes', label: 'Enrolled Classes' }].map(t => (
                            <button key={t.key} onClick={() => setActiveTab(t.key)}
                                className={`px-6 py-2 rounded-none font-bold transition-all text-sm ${activeTab === t.key ? 'bg-theme text-white shadow-sm' : 'text-secondary hover:text-primary'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 pb-8 pt-6">
                    {activeTab === 'ai-path' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
                                <Brain className="text-theme w-5 h-5" /> Personalized AI Path
                            </h2>
                            {hasAIPath ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -5 }}
                                        className="bg-surface rounded-none border border-ui overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col"
                                        onClick={() => navigate('/ai-path')}
                                    >
                                        <div className="h-40 bg-theme relative p-6 flex flex-col justify-end overflow-hidden">
                                            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-surface/10 rounded-full blur-2xl"></div>
                                            <div className="absolute top-4 right-4 bg-surface/20 backdrop-blur px-3 py-1 rounded-none text-xs font-bold text-white flex items-center gap-1">
                                                <Brain size={12} /> AI Generated
                                            </div>
                                            <h3 className="text-2xl font-black text-white leading-tight relative z-10">{aiProfile.onboarding?.field}</h3>
                                            <p className="text-white/80 text-sm font-medium relative z-10">{aiProfile.onboarding?.level} Level</p>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between text-xs font-black text-muted-clr mb-2 uppercase tracking-wider">
                                                    <span>Progress</span><span>{Math.round(aiProgress)}%</span>
                                                </div>
                                                <div className="h-2 bg-surface-2 rounded-none overflow-hidden mb-4">
                                                    <div className="h-full bg-theme rounded-none transition-all" style={{ width: `${aiProgress}%` }}></div>
                                                </div>
                                                <p className="text-secondary text-sm mb-6">{aiProfile.currentPath.modules.length} Modules • Personalized Curriculum</p>
                                            </div>
                                            <button className="w-full py-3 bg-surface-2 group-hover:bg-theme group-hover:text-white text-primary rounded-none font-bold flex items-center justify-center gap-2 transition-all mt-auto">
                                                Continue Path <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="bg-surface border border-dashed border-gray-300 rounded-none p-10 flex flex-col items-center text-center">
                                    <Brain className="w-12 h-12 text-theme opacity-30 mb-4" />
                                    <p className="text-secondary mb-5 font-medium">You don't have an active AI Learning Path.</p>
                                    <button onClick={() => navigate('/onboarding')}
                                        className="bg-theme hover:bg-theme-hover text-white px-6 py-2.5 rounded-none font-bold transition-all shadow-sm">
                                        Create New Path
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'classes' && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                            <h2 className="text-xl font-black text-primary mb-6 flex items-center gap-2">
                                <GraduationCap className="text-theme w-5 h-5" /> Enrolled Classes
                            </h2>
                            {enrolledClasses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {enrolledClasses.map(course => {
                                        const completed = course.studentProgress?.completedTopics?.length || 0;
                                        const totalTopics = course.modules.reduce((acc, m) => acc + m.topics.length, 0);
                                        const progress = totalTopics > 0 ? (completed / totalTopics) * 100 : 0;
                                        return (
                                            <motion.div key={course._id}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ y: -5 }}
                                                className="bg-surface rounded-none border border-ui overflow-hidden hover:shadow-lg transition-all group cursor-pointer flex flex-col"
                                                onClick={() => navigate(`/class/${course._id}`)}
                                            >
                                                <div className="h-40 bg-gray-800 relative p-6 flex flex-col justify-end">
                                                    <div className="absolute top-4 right-4 bg-surface/20 backdrop-blur px-3 py-1 rounded-none text-xs font-bold text-white">Teacher Led</div>
                                                    <h3 className="text-2xl font-black text-white leading-tight truncate">{course.title}</h3>
                                                    <p className="text-gray-300 text-sm font-medium">{course.level}</p>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between text-xs font-black text-muted-clr mb-2 uppercase tracking-wider">
                                                            <span>Progress</span><span>{Math.round(progress)}%</span>
                                                        </div>
                                                        <div className="h-2 bg-surface-2 rounded-none overflow-hidden mb-4">
                                                            <div className="h-full bg-theme" style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                        <p className="text-secondary text-sm mb-6 line-clamp-2">{course.description}</p>
                                                    </div>
                                                    <button className="w-full py-3 bg-surface-2 group-hover:bg-theme group-hover:text-white text-primary rounded-none font-bold flex items-center justify-center gap-2 transition-all mt-auto">
                                                        Go to Class <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-surface border border-dashed border-gray-300 rounded-none p-10 flex flex-col items-center text-center">
                                    <GraduationCap className="w-12 h-12 text-gray-300 mb-4" />
                                    <p className="text-secondary font-medium">You haven't enrolled in any classes yet.</p>
                                    <p className="text-muted-clr text-sm mt-1">Ask your instructor for an invite code.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;

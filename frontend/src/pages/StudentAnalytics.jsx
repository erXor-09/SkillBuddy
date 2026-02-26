import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Clock, BookOpen, Trophy, Brain, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const StudentAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            const [statsRes, coursesRes] = await Promise.all([
                api.get('/gamification/my-stats'),
                api.get('/courses/student/enrolled-classes')
            ]);
            setData({ stats: statsRes.data, courses: coursesRes.data.classes });
        } catch { console.error('Analytics fetch error'); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div className="flex-1 flex items-center justify-center bg-page">
            <div className="text-muted-clr font-semibold">Loading analytics...</div>
        </div>
    );

    const progressData = data?.courses.map(c => ({
        name: c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title,
        progress: Math.round((c.studentProgress.completedTopics.length / (c.modules.reduce((a, m) => a + m.topics.length, 0) || 1)) * 100)
    })) || [];

    const statCards = [
        { title: 'Total XP', value: data?.stats?.points || 0, icon: Trophy, bg: 'bg-amber-500/10', color: 'text-amber-500' },
        { title: 'Streak', value: `${data?.stats?.streak || 0}d`, icon: Flame, bg: 'bg-orange-500/10', color: 'text-orange-500' },
        { title: 'Badges', value: data?.stats?.badges?.length || 0, icon: Target, bg: 'bg-pink-500/10', color: 'text-pink-500' },
        { title: 'Level', value: data?.stats?.level || 1, icon: Brain, bg: 'bg-theme-light', color: 'text-theme' },
    ];

    return (
        <div className="flex flex-col h-full overflow-y-auto p-8 bg-page font-sans">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-primary mb-1">My Analytics</h1>
                <p className="text-secondary font-medium">Track your learning progress and performance.</p>
            </div>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {statCards.map(({ title, value, icon: Icon, bg, color }) => (
                    <motion.div key={title}
                        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-surface rounded-none border border-ui-light p-6 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-black text-muted-clr uppercase tracking-widest mb-1">{title}</p>
                            <h3 className="text-2xl font-black text-primary">{value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-none ${bg} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface rounded-none border border-ui-light p-6 shadow-sm">
                    <h2 className="text-xl font-black text-primary mb-6">Course Progress</h2>
                    {progressData.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={progressData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                    <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={12} tickFormatter={v => `${v}%`} />
                                    <YAxis dataKey="name" type="category" width={110} stroke="#9CA3AF" fontSize={11} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', borderRadius: 0 }}
                                        formatter={(v) => [`${v}%`, 'Progress']}
                                    />
                                    <Bar dataKey="progress" fill="var(--color-theme)" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-muted-clr">
                            <p className="font-medium">No enrolled courses yet.</p>
                        </div>
                    )}
                </div>

                <div className="bg-surface rounded-none border border-ui-light p-6 shadow-sm">
                    <h2 className="text-xl font-black text-primary mb-6">Study Time</h2>
                    <div className="h-64 flex items-center justify-center text-muted-clr">
                        <div className="text-center">
                            <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-lg font-semibold">Total Hours Studied</p>
                            <p className="text-5xl font-black text-theme mt-2">
                                {(data?.stats?.hoursStudied || 0).toFixed(1)}
                                <span className="text-xl text-muted-clr ml-1">h</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-surface rounded-none border border-ui-light p-6 shadow-sm">
                    <h2 className="text-xl font-black text-primary mb-4">Quiz Performance</h2>
                    <div className="text-center text-muted-clr py-8">
                        <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Detailed quiz analysis coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAnalytics;

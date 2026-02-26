import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { Loader } from 'lucide-react';
import api from '../api/axios';

const AnalyticsDashboard = ({ courses }) => {
    const [selectedCourse, setSelectedCourse] = useState(courses[0]?._id || '');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCourse) {
            fetchAnalytics(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchAnalytics = async (courseId) => {
        setLoading(true);
        try {
            const res = await api.get(`/courses/${courseId}/analytics`);
            setData(res.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (courses.length === 0) return <div className="text-muted-clr">No courses available for analytics. Create a course first.</div>;

    return (
        <div className="space-y-6">
            {/* Context Selector */}
            <div className="flex items-center space-x-4 mb-6">
                <label className="text-secondary font-medium">View Report For:</label>
                <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-page border border-ui text-primary rounded-lg px-4 py-2 focus:ring-2 focus:ring-theme outline-none"
                >
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 text-theme animate-pulse">
                    <Loader className="w-8 h-8 mr-2 animate-spin" /> Loading Insight Data...
                </div>
            ) : data ? (
                <>
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatBox label="Enrolled Students" value={data.stats?.totalStudents || 0} />
                        <StatBox label="Active Learners" value={data.stats?.activeStudents || 0} color="text-emerald-600" />
                        <StatBox label="Avg. Class Progress" value={`${data.stats?.avgProgress || 0}%`} />
                        <StatBox label="Avg. Study Time" value={data.stats?.avgTimeSpent || '0h 0m'} color="text-blue-600" />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Engagement Chart */}
                        <div className="bg-surface border border-ui-light rounded-none p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-4">Weekly Engagement</h3>
                            <div className="h-64 w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                                    {data.engagement && data.engagement.dates ? (
                                        <LineChart data={data.engagement.dates.map((date, i) => ({ date, active: data.engagement.active[i] }))}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="date" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#111827', borderRadius: '8px' }} />
                                            <Line type="monotone" dataKey="active" stroke="var(--color-theme)" strokeWidth={3} dot={{ fill: 'var(--color-theme)' }} />
                                        </LineChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-clr">No engagement data</div>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Time Distribution Chart */}
                        <div className="bg-surface border border-ui-light rounded-none p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-4">Study Time Distribution</h3>
                            <div className="h-64 w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                                    {data.timeDistribution ? (
                                        <BarChart data={Object.entries(data.timeDistribution).map(([range, count]) => ({ range, count }))}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="range" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#111827', borderRadius: '8px' }} />
                                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-clr">No distribution data</div>
                                    )}
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Topic Quiz Performance Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-surface border border-ui-light rounded-none p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-4">Hardest Topics (Lowest Avg. Quiz Scores)</h3>
                            <div className="h-64 w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={[
                                        { topic: "Recursion", avgScore: 45 },
                                        { topic: "Graph Theory", avgScore: 52 },
                                        { topic: "Dynamic Programming", avgScore: 58 },
                                        { topic: "Sorting Algorithms", avgScore: 65 },
                                        { topic: "Binary Search", avgScore: 72 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                        <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" />
                                        <YAxis dataKey="topic" type="category" width={120} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#111827', borderRadius: '8px' }} />
                                        <Bar dataKey="avgScore" name="Avg Score" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-surface border border-ui-light rounded-none p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-primary mb-4">Topic Fail Rates</h3>
                            <div className="h-64 w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart layout="vertical" data={[
                                        { topic: "Recursion", failRate: 35 },
                                        { topic: "Pointers", failRate: 28 },
                                        { topic: "Memory Management", failRate: 25 },
                                        { topic: "Promises", failRate: 20 },
                                        { topic: "Async/Await", failRate: 15 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                        <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" />
                                        <YAxis dataKey="topic" type="category" width={120} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#111827', borderRadius: '8px' }} />
                                        <Bar dataKey="failRate" name="Fail Rate (%)" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Card */}
                    <div className="bg-theme-light border border-theme/20 rounded-none p-6">
                        <h4 className="flex items-center text-theme font-bold mb-2">
                            ✨ AI Insight
                        </h4>
                        <p className="text-secondary">
                            Engagement has dropped by 15% this week compared to last week. Consider scheduling a live Q&A session or posting a new announcement to re-engage students.
                        </p>
                    </div>
                </>
            ) : (
                <div className="text-center text-muted-clr mt-10">Select a course to view analytics.</div>
            )}
        </div>
    );
};

const StatBox = ({ label, value, color = "text-primary" }) => (
    <div className="bg-surface border border-ui-light rounded-none p-4 shadow-sm">
        <p className="text-muted-clr text-xs uppercase tracking-wider mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
);

export default AnalyticsDashboard;

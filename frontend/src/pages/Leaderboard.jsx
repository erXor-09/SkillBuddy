import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Flame, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [lbRes, mpRes] = await Promise.all([
                api.get('/gamification/leaderboard'),
                api.get('/gamification/my-stats')
            ]);
            setLeaderboard(lbRes.data.leaderboard);
            setStats(mpRes.data);
        } catch { console.error('Failed to load leaderboard'); }
        finally { setLoading(false); }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
            case 2: return <Medal className="w-6 h-6 text-muted-clr" />;
            case 3: return <Medal className="w-6 h-6 text-orange-500" />;
            default: return <span className="text-muted-clr font-black w-6 text-center text-sm">{rank}</span>;
        }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-page font-sans">
            <div className="bg-surface border-b border-ui p-6 flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-amber-50 rounded-none flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-primary">Leaderboard</h1>
                    <p className="text-sm text-secondary">Top learners this week</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">

                    {/* Main Leaderboard */}
                    <div className="flex-1 bg-surface rounded-none border border-ui shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-ui-light">
                            <h2 className="text-lg font-black text-primary">Top Learners</h2>
                            <p className="text-sm text-secondary">Competing for glory this week</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {leaderboard.map((user, i) => (
                                <motion.div
                                    key={user.rank}
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                    className={`flex items-center p-4 hover:bg-page transition-colors ${user.isCurrentUser ? 'bg-theme-light border-l-4 border-theme' : ''}`}
                                >
                                    <div className="w-12 flex justify-center flex-shrink-0">{getRankIcon(user.rank)}</div>
                                    <div className="flex-1 ml-4">
                                        <h3 className={`font-black ${user.isCurrentUser ? 'text-theme' : 'text-primary'}`}>
                                            {user.name} {user.isCurrentUser && <span className="text-xs font-bold opacity-70">(You)</span>}
                                        </h3>
                                        <div className="flex items-center text-xs text-secondary gap-3 mt-0.5">
                                            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-500" /> {user.streak}d streak</span>
                                            <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-blue-500" /> {user.badges} badges</span>
                                        </div>
                                    </div>
                                    <div className="text-right px-4">
                                        <div className="text-amber-500 font-black text-lg">{user.points}</div>
                                        <div className="text-xs text-muted-clr">pts</div>
                                    </div>
                                </motion.div>
                            ))}
                            {leaderboard.length === 0 && !loading && (
                                <div className="p-10 text-center text-muted-clr">No active learners yet. Be the first!</div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full md:w-80 space-y-6">
                        {stats && (
                            <div className="bg-theme rounded-none p-6 text-white shadow-lg relative overflow-hidden">
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-surface/10 rounded-full blur-2xl"></div>
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h3 className="font-black text-lg">Your Stats</h3>
                                    <Star className="w-5 h-5 text-amber-300" />
                                </div>
                                <div className="grid grid-cols-2 gap-3 relative z-10">
                                    {[
                                        { label: 'Points', val: stats.points },
                                        { label: 'Level', val: stats.level },
                                        { label: 'Streak', val: stats.streak },
                                        { label: 'Badges', val: stats.badges?.length || 0 },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="bg-surface/10 rounded-none p-3 text-center backdrop-blur-sm">
                                            <div className="text-2xl font-black">{val}</div>
                                            <div className="text-xs text-white/70 uppercase tracking-widest mt-0.5">{label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-surface rounded-none border border-ui shadow-sm p-6">
                            <h3 className="font-black text-primary mb-4">How to earn points?</h3>
                            <ul className="space-y-3 text-sm text-secondary">
                                {[
                                    { text: 'Complete a module', pts: 100 },
                                    { text: 'Finish a quiz', pts: 50 },
                                    { text: 'Daily login streak', pts: 10 },
                                    { text: 'Answer doubts', pts: 20 },
                                ].map(({ text, pts }) => (
                                    <li key={text} className="flex justify-between">
                                        <span>{text}</span>
                                        <span className="text-theme font-black">+{pts}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;

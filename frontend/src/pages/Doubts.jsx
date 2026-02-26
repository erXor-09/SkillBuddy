import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Send, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Doubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newDoubt, setNewDoubt] = useState({ title: '', description: '', tags: '' });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchDoubts(); }, []);

    const fetchDoubts = async () => {
        try {
            const res = await api.get('/doubts/my');
            setDoubts(res.data.doubts);
        } catch { console.error('Failed to fetch doubts'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/doubts', { ...newDoubt, tags: newDoubt.tags.split(',').map(t => t.trim()) });
            setNewDoubt({ title: '', description: '', tags: '' });
            setShowForm(false);
            fetchDoubts();
        } catch { alert('Failed to post doubt'); }
    };

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-page font-sans">
            <div className="bg-surface border-b border-ui p-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-theme-light rounded-none flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-theme" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-primary">Doubt Resolution</h1>
                        <p className="text-sm text-secondary">Ask questions, get AI-powered answers.</p>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowForm(!showForm)}
                    className={`px-5 py-2.5 rounded-none font-bold flex items-center gap-2 transition-all shadow-sm ${showForm ? 'bg-surface-2 text-primary border border-ui' : 'bg-theme text-white'}`}
                >
                    {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Ask Question</>}
                </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {showForm && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-ui rounded-none p-6 shadow-sm">
                            <h2 className="text-lg font-black text-primary mb-5">Ask a Question</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-1">Title</label>
                                    <input type="text" value={newDoubt.title} onChange={e => setNewDoubt({ ...newDoubt, title: e.target.value })}
                                        className="w-full bg-page border border-ui rounded-none px-4 py-2.5 text-primary focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                        required placeholder="e.g. How does useEffect work?" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-1">Description</label>
                                    <textarea value={newDoubt.description} onChange={e => setNewDoubt({ ...newDoubt, description: e.target.value })}
                                        className="w-full bg-page border border-ui rounded-none px-4 py-2.5 text-primary focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all h-28 resize-none"
                                        required placeholder="Describe your doubt in detail..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-secondary mb-1">Tags <span className="text-muted-clr font-normal">(comma separated)</span></label>
                                    <input type="text" value={newDoubt.tags} onChange={e => setNewDoubt({ ...newDoubt, tags: e.target.value })}
                                        className="w-full bg-page border border-ui rounded-none px-4 py-2.5 text-primary focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                        placeholder="react, hooks, javascript" />
                                </div>
                                <button type="submit" className="bg-theme hover:bg-theme-hover text-white font-bold py-2.5 px-6 rounded-none transition-all flex items-center gap-2 shadow-sm">
                                    <Send className="w-4 h-4" /> Post Doubt
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {doubts.map((doubt, i) => (
                        <motion.div key={doubt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-surface rounded-none border border-ui shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-primary mb-2">{doubt.title}</h3>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {doubt.tags.map((tag, j) => (
                                                <span key={j} className="text-xs bg-theme-light text-theme font-bold px-2.5 py-1 rounded-none">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-none text-xs font-black uppercase ml-4 ${doubt.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {doubt.status}
                                    </span>
                                </div>
                                <p className="text-secondary mb-5 leading-relaxed">{doubt.description}</p>
                                {doubt.answers?.length > 0 && (
                                    <div className="bg-theme-light rounded-none p-4 border-l-4 border-theme">
                                        <div className="flex items-center gap-2 mb-2 text-theme">
                                            <Bot className="w-4 h-4" />
                                            <span className="font-bold text-sm">AI Assistant</span>
                                        </div>
                                        <p className="text-primary text-sm leading-relaxed">{doubt.answers[0].content}</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {doubts.length === 0 && !loading && (
                        <div className="text-center py-16 text-muted-clr">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-semibold">No doubts asked yet. Ask your first question!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Doubts;

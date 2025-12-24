import React, { useState, useEffect } from 'react';
import { X, Book, CheckCircle, Play, FileText, ExternalLink, Loader, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const TopicDetailModal = ({ moduleId, topicId, onClose, onUpdate }) => {
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopicDetails();
    }, [moduleId, topicId]);

    const fetchTopicDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/courses/module/${moduleId}/topic/${topicId}`);
            setTopic(res.data.topic);
        } catch (error) {
            console.error("Failed to load topic");
        } finally {
            setLoading(false);
        }
    };

    const toggleResource = async (resourceId, currentStatus) => {
        const newStatus = !currentStatus;
        try {
            const updatedResources = topic.resources.map(r =>
                (r.id === resourceId || r._id === resourceId) ? { ...r, completed: newStatus } : r
            );
            setTopic({ ...topic, resources: updatedResources });

            await api.post('/courses/progress', {
                moduleId,
                topicId,
                resourceId,
                progress: newStatus ? 100 : 0
            });

            if (onUpdate) onUpdate();

        } catch (error) {
            console.error("Failed to update progress");
        }
    };

    if (!topicId) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Sidebar Drawer */}
            <div className="relative w-full max-w-2xl h-full bg-[#111] border-l border-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-slide-in-right">

                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-[#151515] flex justify-between items-start sticky top-0 z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{loading ? 'Loading...' : topic?.title}</h2>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${topic?.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {topic?.status || 'Pending'}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#0a0a0a]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                            <Loader className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p>Curating personalized resources...</p>
                        </div>
                    ) : (
                        <div className="space-y-10">

                            {/* Description */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                                    <Book className="w-5 h-5 mr-3 text-purple-500" />
                                    Topic Overview
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-lg">
                                    {topic?.description}
                                </p>
                            </div>

                            {/* Detailed Content / Guide */}
                            {topic?.content && (
                                <div className="bg-[#151515] rounded-xl p-6 border border-gray-800 shadow-sm">
                                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                        {topic.content.split('\n').map((line, i) => {
                                            if (line.trim().startsWith('###')) {
                                                return <h4 key={i} className="text-lg font-bold text-white mt-6 mb-3 border-b border-gray-700 pb-2">{line.replace(/###/g, '').trim()}</h4>;
                                            }
                                            if (line.trim().startsWith('**')) {
                                                return <strong key={i} className="block text-white mt-4 mb-2">{line.replace(/\*\*/g, '')}</strong>;
                                            }
                                            if (line.trim().length === 0) return <br key={i} />;
                                            return <p key={i} className="mb-2 leading-relaxed opacity-90">{line.replace(/\*\*/g, '')}</p>;
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Resources List */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center">
                                    <ExternalLink className="w-5 h-5 mr-3 text-blue-500" />
                                    Recommended Resources
                                </h3>
                                <div className="space-y-4">
                                    {topic?.resources?.map((resource, i) => (
                                        <div
                                            key={i}
                                            className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${resource.completed
                                                    ? 'bg-green-900/10 border-green-500/30'
                                                    : 'bg-[#151515] border-gray-800 hover:border-gray-600'
                                                }`}
                                        >
                                            <div className={`mt-1 p-2 rounded-lg flex-shrink-0 ${resource.type === 'youtube' ? 'bg-red-500/10 text-red-500' :
                                                    resource.type === 'book' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                }`}>
                                                {resource.type === 'youtube' ? <Play size={20} /> : resource.type === 'book' ? <Book size={20} /> : <FileText size={20} />}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block font-semibold text-gray-200 hover:text-blue-400 transition truncate pr-2 text-lg"
                                                >
                                                    {resource.title}
                                                </a>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                    <span className="capitalize px-2 py-0.5 rounded bg-gray-800">{resource.type}</span>
                                                    <span>•</span>
                                                    <span>{resource.duration || '10 min'}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleResource(resource.id || resource._id, resource.completed)}
                                                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${resource.completed
                                                        ? 'bg-green-500 border-green-500 text-white scale-110'
                                                        : 'border-gray-600 text-transparent hover:border-green-500'
                                                    }`}
                                                title="Mark as Done"
                                            >
                                                <CheckCircle size={16} fill={resource.completed ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    ))}

                                    {(!topic?.resources || topic.resources.length === 0) && (
                                        <div className="text-gray-500 text-center py-4 italic">No external links found for this topic.</div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-800 bg-[#151515] sticky bottom-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <a
                        href={`https://google.com/search?q=${topic?.title} ${topic?.description} tutorial`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center w-full py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all group border border-gray-700 hover:border-gray-600"
                    >
                        Search More on Google <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TopicDetailModal;

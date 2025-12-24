import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Book, CheckCircle, Circle, MessageSquare, Loader } from 'lucide-react';
import api from '../api/axios';

const CourseView = () => {
    const { moduleId, topicId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState(null);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const res = await api.get(`/courses/module/${moduleId}/topic/${topicId}`);
                setTopic(res.data.topic);
            } catch (error) {
                console.error("Failed to fetch topic", error);
            } finally {
                setLoading(false);
            }
        };
        if (moduleId && topicId) fetchTopic();
    }, [moduleId, topicId]);

    const handleResourceClick = async (resourceId, currentStatus) => {
        if (currentStatus) return; // Already done
        try {
            // Optimistic update
            const updatedResources = topic.resources.map(r =>
                (r._id === resourceId || r.id === resourceId) ? { ...r, completed: true } : r
            );
            setTopic({ ...topic, resources: updatedResources });

            await api.post('/courses/progress', { moduleId, topicId, resourceId, progress: 100 });
        } catch (error) {
            console.error("Failed to update progress");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loader className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
    );

    if (!topic) return <div className="text-white text-center mt-20">Topic not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-700 rounded-lg transition">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">{topic.title}</h1>
                        <p className="text-sm text-gray-400">{topic.description}</p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => navigate('/doubts')} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition">
                        <MessageSquare className="w-4 h-4" />
                        <span>Ask Doubt</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-8 max-w-5xl mx-auto w-full">

                {/* AI Detailed Guide */}
                {topic.content && (
                    <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 mb-8 shadow-xl">
                        <div className="flex items-center mb-6">
                            <Book className="w-6 h-6 text-purple-400 mr-3" />
                            <h2 className="text-2xl font-bold text-white">Topic Guide</h2>
                        </div>
                        <div className="prose prose-invert max-w-none prose-purple">
                            {topic.content.split('\\n').map((line, i) => (
                                <p key={i} className="mb-4 text-gray-300 leading-relaxed">
                                    {line.replace(/###/g, '').replace(/\*\*/g, '')}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resources List */}
                <h2 className="text-2xl font-bold mb-6">Learning Resources</h2>
                <div className="grid gap-4">
                    {topic.resources?.map((resource, idx) => (
                        <div key={idx} className={`bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center transition hover:border-purple-500/50 ${resource.completed ? 'opacity-75' : ''}`}>
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${resource.type === 'video' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {resource.type === 'video' ? <Play className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-400 hover:underline block truncate max-w-md">
                                        {resource.url}
                                    </a>
                                    <span className="text-xs text-gray-500 mt-1 block capitalize">{resource.type} • {resource.duration || '5 mins'}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleResourceClick(resource._id || resource.id, resource.completed)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${resource.completed ? 'text-green-400' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
                            >
                                {resource.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                                <span className="text-sm font-medium">{resource.completed ? 'Completed' : 'Mark Complete'}</span>
                            </button>
                        </div>
                    ))}
                </div>

                {topic.resources?.length === 0 && (
                    <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
                        <p className="text-gray-400">AI is curating resources for this topic...</p>
                    </div>
                )}

                {/* Practice Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Practice & Assessment</h2>
                    <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-8 rounded-2xl border border-purple-500/30">
                        <h3 className="text-xl font-bold mb-2">Ready to test your knowledge?</h3>
                        <p className="text-gray-300 mb-6">Take a quick quiz to verify your understanding of {topic.title}.</p>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-purple-900/40">
                            Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;

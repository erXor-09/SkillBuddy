import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import api from '../../../../services/api';

const TeacherCourses = ({ courses, onCourseCreated }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            field: formData.get('field'),
            level: formData.get('level')
        };

        try {
            await api.post('/courses/create', data);
            setShowCreateModal(false);
            onCourseCreated(); // Refresh courses in parent
            alert("Class created successfully!");
        } catch (error) {
            console.error("Error creating course:", error);
            const errorMsg = error.response?.data?.error || "Failed to create course. Please try again.";
            alert(errorMsg);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
                <div key={course._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors group">
                    <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                        <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">{course.level}</span>
                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
            <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-white hover:border-purple-500 hover:bg-white/5 transition-all group min-h-[200px]"
            >
                <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Create New Course</span>
            </button>

            {/* Create Class Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Create New Class</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClass} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Class Title</label>
                                <input required name="title" type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" placeholder="e.g. Advanced React Patterns" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Field</label>
                                <select name="field" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none">
                                    <option value="Frontend">Frontend Development</option>
                                    <option value="Backend">Backend Development</option>
                                    <option value="Fullstack">Fullstack Development</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Level</label>
                                <select name="level" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea required name="description" rows="3" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none" placeholder="What will students learn?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-purple-900/20">
                                Create Class
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherCourses;

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Trash2, Mail, RefreshCw, Check } from 'lucide-react';
import api from '../api/axios';

const ManageStudentsModal = ({ course, onClose, onUpdate }) => {
    const [identifier, setIdentifier] = useState('');
    const [loading, setLoading] = useState(false);
    const [studentsData, setStudentsData] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [bulkLoading, setBulkLoading] = useState(false);

    const fetchStudentProgress = async () => {
        try {
            const response = await api.get(`/courses/${course._id}/analytics`);
            if (response.data.students) {
                setStudentsData(response.data.students);
            }
        } catch (error) {
            console.error("Failed to fetch student progress", error);
        }
    };

    const fetchAvailableStudents = async () => {
        setRefreshing(true);
        try {
            const response = await api.get('/auth/students');
            const allStudents = response.data.students || [];
            const shuffled = allStudents.sort(() => 0.5 - Math.random());
            setAvailableStudents(shuffled.slice(0, 10));
        } catch (error) {
            console.error("Failed to fetch available students", error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStudentProgress();
        fetchAvailableStudents();
    }, [course._id]);

    const handleAddStudent = async (e, specificEmail = null) => {
        if (e) e.preventDefault();
        const emailToAdd = specificEmail || identifier;

        if (!emailToAdd) return;

        if (specificEmail) setLoadingId(specificEmail);
        else setLoading(true);

        try {
            await api.post(`/courses/${course._id}/enroll`, { identifier: emailToAdd });

            if (!specificEmail) {
                alert('Student added successfully');
                setIdentifier('');
            }

            onUpdate();
            fetchStudentProgress();
            fetchAvailableStudents();

        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add student');
        } finally {
            setLoading(false);
            setLoadingId(null);
        }
    };

    const toggleSelection = (email) => {
        const newSelection = new Set(selectedStudents);
        if (newSelection.has(email)) {
            newSelection.delete(email);
        } else {
            newSelection.add(email);
        }
        setSelectedStudents(newSelection);
    };

    const handleBulkAdd = async () => {
        if (selectedStudents.size === 0) return;

        setBulkLoading(true);
        try {
            const identifiers = Array.from(selectedStudents);
            const response = await api.post(`/courses/${course._id}/enroll`, { identifiers });

            const { results } = response.data;
            let msg = `Added ${results.added.length} students.`;
            if (results.failed.length > 0) msg += ` Failed: ${results.failed.length}.`;
            if (results.alreadyEnrolled.length > 0) msg += ` Already in: ${results.alreadyEnrolled.length}.`;

            alert(msg);

            setSelectedStudents(new Set());
            onUpdate();
            fetchStudentProgress();
            fetchAvailableStudents();

        } catch (error) {
            alert(error.response?.data?.error || 'Failed to add students');
        } finally {
            setBulkLoading(false);
        }
    };

    const isEnrolled = (email) => {
        return studentsData.some(s => s.email === email);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-surface rounded-2xl w-full max-w-4xl border border-ui shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

                {/* LEFT SIDE: Active Students */}
                <div className="flex-1 border-r border-ui-light flex flex-col min-w-0">
                    <div className="p-6 border-b border-ui-light bg-page">
                        <h3 className="text-xl font-bold text-primary">Enrolled Students</h3>
                        <p className="text-sm text-secondary">{course.title} • {studentsData.length} Students</p>
                    </div>

                    <div className="p-4 overflow-y-auto flex-1">
                        {studentsData.length > 0 ? (
                            <div className="space-y-3">
                                {studentsData.map((student) => (
                                    <div key={student.studentId || student._id} className="flex items-center justify-between p-3 bg-page rounded-lg border border-ui-light">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-theme-light flex items-center justify-center text-theme font-bold text-xs border border-theme/20">
                                                {student.name ? student.name[0] : 'S'}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-primary max-w-[120px] truncate">{student.name || 'Unknown'}</div>
                                                <div className="text-xs text-muted-clr max-w-[120px] truncate">{student.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="text-xs font-medium text-emerald-600">{student.percentage || 0}%</div>
                                                <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${student.percentage || 0}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-clr border border-dashed border-ui rounded-xl m-2">
                                No students enrolled yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: Add Students */}
                <div className="flex-1 flex flex-col min-w-0 bg-surface">
                    <div className="p-6 border-b border-ui-light flex justify-between items-center bg-page">
                        <div>
                            <h3 className="text-lg font-bold text-primary">Add Students</h3>
                            <p className="text-sm text-secondary">Invite new learners</p>
                        </div>
                        <button onClick={onClose} className="text-muted-clr hover:text-primary transition">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        {/* Manual Search */}
                        <form onSubmit={(e) => handleAddStudent(e)} className="mb-8">
                            <label className="block text-xs font-bold text-muted-clr uppercase tracking-widest mb-3">Add by Email/Username</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-3 text-muted-clr w-5 h-5" />
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="email@example.com"
                                        className="w-full bg-page border border-ui rounded-xl pl-10 pr-4 py-2.5 text-primary focus:ring-2 focus:ring-theme outline-none text-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !identifier}
                                    className="bg-theme hover:bg-theme-hover text-white px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>

                        {/* Quick Add List with Bulk Selection */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-xs font-bold text-muted-clr uppercase tracking-widest">Quick Add (Suggestions)</label>
                                <div className="flex gap-3">
                                    {selectedStudents.size > 0 && (
                                        <button
                                            onClick={handleBulkAdd}
                                            disabled={bulkLoading}
                                            className="text-xs bg-theme hover:bg-theme-hover text-white px-3 py-1 rounded-lg font-bold transition flex items-center gap-1 shadow-sm disabled:opacity-50"
                                        >
                                            {bulkLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                                            Add Selected ({selectedStudents.size})
                                        </button>
                                    )}
                                    <button
                                        onClick={fetchAvailableStudents}
                                        disabled={refreshing}
                                        className="text-xs flex items-center gap-1 text-theme hover:text-theme-hover transition"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} /> Refresh Lists
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {availableStudents.map((student) => {
                                    const alreadyEnrolled = isEnrolled(student.email);
                                    const isSelected = selectedStudents.has(student.email);
                                    const isadding = loadingId === student.email;

                                    return (
                                        <div
                                            key={student._id}
                                            className={`flex items-center justify-between p-3 rounded-lg border transition group cursor-pointer ${isSelected ? 'bg-theme-light border-theme/20' : 'bg-page border-ui-light hover:border-ui'}`}
                                            onClick={() => !alreadyEnrolled && toggleSelection(student.email)}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {!alreadyEnrolled && (
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-theme border-theme' : 'border-gray-300 bg-surface'}`}>
                                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                )}

                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200 flex-shrink-0">
                                                    {student.name ? student.name[0] : 'U'}
                                                </div>
                                                <div className="min-w-0 select-none">
                                                    <div className="text-sm font-medium text-primary truncate">{student.name}</div>
                                                    <div className="text-xs text-muted-clr truncate">{student.email}</div>
                                                </div>
                                            </div>

                                            {alreadyEnrolled ? (
                                                <span className="text-xs text-emerald-600 font-medium px-3 py-1 bg-emerald-50 rounded-full flex items-center gap-1">
                                                    <Check className="w-3 h-3" /> Added
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddStudent(null, student.email);
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 bg-surface-2 hover:bg-theme text-secondary hover:text-white p-2 rounded-lg transition-all shadow-sm disabled:opacity-50"
                                                    title="Add this student"
                                                    disabled={isadding}
                                                >
                                                    {isadding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                                {availableStudents.length === 0 && (
                                    <div className="text-center text-sm text-muted-clr py-4">
                                        No suggestions available.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStudentsModal;

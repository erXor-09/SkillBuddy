import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const TeacherStudents = ({ students }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
            <table className="w-full text-left text-gray-300">
                <thead className="bg-gray-700/50 uppercase text-xs font-semibold text-gray-400">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                    {students.map(student => (
                        <tr key={student._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white overflow-hidden">
                                    {student.avatar ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}${student.avatar}`}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        student.name[0]
                                    )}
                                </div>
                                <span className="font-medium text-white">{student.name}</span>
                            </td>
                            <td className="px-6 py-4">{student.email}</td>
                            <td className="px-6 py-4 capitalize">{student.role}</td>
                            <td className="px-6 py-4 text-gray-400 text-sm">
                                {formatDate(student.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => setSelectedStudent(student)}
                                    className="text-purple-400 hover:text-purple-300 p-2 hover:bg-purple-500/10 rounded-full transition-colors"
                                    title="View Details"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {students.length === 0 && (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No students found.</td></tr>
                    )}
                </tbody>
            </table>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white overflow-hidden mb-4 border-4 border-gray-800 ring-2 ring-purple-500/50">
                                    {selectedStudent.avatar ? (
                                        <img
                                            src={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}${selectedStudent.avatar}`}
                                            alt={selectedStudent.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        selectedStudent.name[0]
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-white">{selectedStudent.name}</h2>
                                <p className="text-purple-400">{selectedStudent.email}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500 block">Phone</span>
                                            <span className="text-white">{selectedStudent.phone || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Joined</span>
                                            <span className="text-white">{formatDate(selectedStudent.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {selectedStudent.bio || "No bio available."}
                                    </p>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Enrolled Courses</h3>
                                    {selectedStudent.enrolledCourses && selectedStudent.enrolledCourses.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStudent.enrolledCourses.map((course, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/20">
                                                    {course.title || "Untitled Course"}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No active enrollments.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherStudents;

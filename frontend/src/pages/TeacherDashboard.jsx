import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getImageUrl } from '../utils/helpers';

import TeacherSidebar from '../components/dashboard/teacher/TeacherSidebar';
import TeacherOverview from '../components/dashboard/teacher/TeacherOverview';
import TeacherStudents from '../components/dashboard/teacher/TeacherStudents';
import TeacherCourses from '../components/dashboard/teacher/TeacherCourses';
import TeacherDoubts from '../components/dashboard/teacher/TeacherDoubts';
import TeacherAnalytics from '../components/dashboard/teacher/TeacherAnalytics';

const TeacherDashboard = ({ user, onLogout }) => {
    const [activeSection, setActiveSection] = useState('overview');
    const [stats, setStats] = useState({ students: 0, courses: 0, doubts: 0 });
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial Data Load
    useEffect(() => {
        fetchOverviewData();
    }, []);

    // Section Data Load
    useEffect(() => {
        if (activeSection === 'students') fetchStudents();
        if (activeSection === 'courses') fetchCourses();
        if (activeSection === 'doubts') fetchDoubts();
    }, [activeSection]);

    const fetchOverviewData = async () => {
        try {
            const [studentsRes, coursesRes, doubtsRes] = await Promise.all([
                api.get('/auth/students'),
                api.get('/courses/teacher-courses'),
                api.get('/doubts/all')
            ]);
            setStats({
                students: studentsRes.data.students.length,
                courses: coursesRes.data.courses.length,
                doubts: doubtsRes.data.doubts.length
            });
        } catch (error) {
            console.error("Error fetching overview data:", error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await api.get('/auth/students');
            setStudents(res.data.students);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await api.get('/courses/teacher-courses');
            setCourses(res.data.courses);
        } catch (error) {
            console.error("Error fetching courses:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoubts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/doubts/all');
            setDoubts(res.data.doubts);
        } catch (error) {
            console.error("Error fetching doubts:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        if (loading) return <div className="p-8 text-white">Loading...</div>;

        switch (activeSection) {
            case 'overview':
                return <TeacherOverview stats={stats} />;
            case 'students':
                return <TeacherStudents students={students} />;
            case 'courses':
                return <TeacherCourses courses={courses} onCourseCreated={() => { fetchCourses(); fetchOverviewData(); }} />;
            case 'doubts':
                return <TeacherDoubts doubts={doubts} />;
            case 'analytics':
                return <TeacherAnalytics />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
            <TeacherSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                onLogout={onLogout}
            />

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <header className="h-20 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-8 z-10">
                    <div className="text-xl font-medium">Hello, {user.name}</div>
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold hover:ring-2 hover:ring-purple-400 transition-all text-white overflow-hidden">
                            {user.avatar ? (
                                <img
                                    src={getImageUrl(user.avatar)}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user.name ? user.name[0] : 'T'
                            )}
                        </Link>
                    </div>
                </header>

                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <h2 className="text-2xl font-bold text-white mb-6 capitalize">{activeSection}</h2>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, BarChart, Plus, MessageCircle, X, ListChecks, LogOut, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import CurriculumBuilder from '../components/CurriculumBuilder';
import DoubtReplyModal from '../components/DoubtReplyModal';
import ManageStudentsModal from '../components/ManageStudentsModal';
import EditProfileModal from '../components/EditProfileModal';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const TeacherDashboard = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const [activeSection, setActiveSection] = useState('overview');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const [stats, setStats] = useState({ students: 0, courses: 0, doubts: 0 });
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [editingCourse, setEditingCourse] = useState(null);
    const [replyingDoubt, setReplyingDoubt] = useState(null);
    const [managingStudentsCourse, setManagingStudentsCourse] = useState(null);

    // Expose section setter for Sidebar
    useEffect(() => {
        window.__setTeacherSection = setActiveSection;
        return () => { delete window.__setTeacherSection; };
    }, []);

    useEffect(() => {
        fetchOverviewData();
    }, []);

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
                doubts: doubtsRes.data.doubts.filter(d => d.status !== 'answered').length
            });
            setCourses(coursesRes.data.courses);
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
            fetchCourses();
            fetchOverviewData();
            alert("Class created successfully!");
        } catch (error) {
            console.error("Error creating course:", error);
            const errorMsg = error.response?.data?.error || "Failed to create course. Please try again.";
            alert(errorMsg);
        }
    };

    const renderContent = () => {
        if (loading && activeSection !== 'analytics') return <div className="p-8 text-secondary">Loading...</div>;

        switch (activeSection) {
            case 'overview':
                return (
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={Users} label="Total Students" value={stats.students} iconColor="text-blue-500" iconBg="bg-blue-500/10" />
                            <StatCard icon={BookOpen} label="Active Courses" value={stats.courses} iconColor="text-theme" iconBg="bg-theme-light" />
                            <StatCard icon={MessageCircle} label="Pending Doubts" value={stats.doubts} iconColor="text-amber-500" iconBg="bg-amber-500/10" />
                        </motion.div>

                        <motion.div variants={fadeUp} className="bg-surface rounded-none p-6 border border-ui-light shadow-sm">
                            <h3 className="text-xl font-bold text-primary mb-4">Class Performance Snapshot</h3>
                            <p className="text-secondary mb-4">Overview of one of your active courses.</p>
                            {courses.length > 0 ? <AnalyticsDashboard courses={[courses[0]]} /> : <p className="text-muted-clr">No courses to display analytics for.</p>}
                        </motion.div>
                    </motion.div>
                );
            case 'students':
                return (
                    <div className="bg-surface rounded-none overflow-hidden border border-ui-light shadow-sm">
                        <table className="w-full text-left text-secondary">
                            <thead className="bg-page uppercase text-xs font-semibold text-secondary">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {students.map(student => (
                                    <tr key={student._id} className="hover:bg-page">
                                        <td className="px-6 py-4 font-medium text-primary">{student.name}</td>
                                        <td className="px-6 py-4">{student.email}</td>
                                        <td className="px-6 py-4 capitalize">{student.role}</td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-8 text-center text-muted-clr">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            case 'courses':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <motion.div key={course._id} variants={fadeUp} className="bg-surface rounded-none p-6 border border-ui-light shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary mb-2">{course.title}</h3>
                                    <p className="text-secondary text-sm mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between text-xs font-medium text-muted-clr mb-4">
                                        <span className="px-2 py-1 bg-surface-2 rounded text-secondary">{course.level}</span>
                                        <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="border-t border-ui-light pt-4 mt-auto">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingCourse(course)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-surface-2 hover:bg-theme-light text-primary hover:text-theme py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <ListChecks className="w-4 h-4" /> Curriculum
                                        </button>
                                        <button
                                            onClick={() => setManagingStudentsCourse(course)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-surface-2 hover:bg-theme-light text-primary hover:text-theme py-2 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Users className="w-4 h-4" /> Students
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-page border-2 border-dashed border-ui rounded-none p-6 flex flex-col items-center justify-center text-muted-clr hover:text-theme hover:border-theme hover:bg-theme-light transition-all group min-h-[200px]"
                        >
                            <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Create New Course</span>
                        </button>
                    </div>
                );
            case 'doubts':
                return (
                    <div className="space-y-4">
                        {doubts.map(doubt => (
                            <motion.div key={doubt._id} variants={fadeUp} className="bg-surface rounded-none p-6 border border-ui-light shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-primary">{doubt.title}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${doubt.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {doubt.status}
                                    </span>
                                </div>
                                <p className="text-secondary text-sm mb-4">{doubt.description}</p>
                                <div className="text-xs text-muted-clr">
                                    Current Answers: {doubt.answers.length}
                                </div>
                                <div className="mt-4 pt-4 border-t border-ui-light flex gap-2">
                                    <button
                                        onClick={() => setReplyingDoubt(doubt)}
                                        className="text-sm text-theme hover:text-theme-hover font-medium bg-theme-light px-4 py-2 rounded-lg"
                                    >
                                        Reply to Doubt
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                        {doubts.length === 0 && (
                            <div className="text-center text-muted-clr mt-10">No doubts raised yet.</div>
                        )}
                    </div>
                );
            case 'analytics':
                return (
                    <div className="bg-surface rounded-none border border-ui-light shadow-sm p-6">
                        <AnalyticsDashboard courses={courses} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ background: darkMode ? '#0F1117' : '#F9FAFB' }}>
            {/* Top Header */}
            <header
                className="h-16 flex items-center justify-between px-8 shrink-0 sticky top-0 z-40"
                style={{ background: darkMode ? '#1A1D27' : '#FFFFFF', borderBottom: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}` }}
            >
                <div className="text-base font-semibold" style={{ color: darkMode ? '#94A3B8' : '#374151' }}>
                    Hello, <span className="text-theme font-black">{user.name}</span> 👋
                </div>
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-theme hover:bg-theme-hover text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Create Class
                    </button>
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            title="Profile Menu"
                            className="w-9 h-9 rounded-full bg-theme flex items-center justify-center text-white text-sm font-black overflow-hidden hover:ring-2 hover:ring-theme hover:ring-offset-2 transition-all"
                            style={{ border: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}` }}
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name ? user.name[0].toUpperCase() : 'U'
                            )}
                        </button>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-3 w-48 rounded-xl shadow-xl border py-1 z-50 overflow-hidden"
                                    style={{ background: darkMode ? '#1A1D27' : '#FFFFFF', borderColor: darkMode ? '#2D3249' : '#E5E7EB' }}
                                >
                                    <div className="px-4 py-3 border-b" style={{ borderColor: darkMode ? '#2D3249' : '#E5E7EB' }}>
                                        <p className="text-sm font-bold truncate" style={{ color: darkMode ? '#F1F5F9' : '#111827' }}>{user?.name}</p>
                                        <p className="text-xs truncate" style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-theme-light hover:text-theme transition-colors"
                                        style={{ color: darkMode ? '#E2E8F0' : '#374151' }}
                                    >
                                        <UserIcon className="w-4 h-4" /> Edit Profile
                                    </button>
                                    <button
                                        onClick={() => { setShowProfileMenu(false); onLogout(); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <h2 className="text-2xl font-bold text-primary mb-6 capitalize">{activeSection}</h2>
                {renderContent()}
            </div>

            {/* Create Class Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-2xl w-full max-w-md border border-ui shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-ui-light flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Create New Class</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-muted-clr hover:text-primary">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClass} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Class Title</label>
                                <input required name="title" type="text" className="w-full bg-page border border-ui rounded-lg px-4 py-3 text-primary focus:ring-2 focus:ring-theme focus:border-transparent outline-none" placeholder="e.g. Advanced React Patterns" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Field</label>
                                <select name="field" className="w-full bg-page border border-ui rounded-lg px-4 py-3 text-primary focus:ring-2 focus:ring-theme outline-none">
                                    <option value="Frontend">Frontend Development</option>
                                    <option value="Backend">Backend Development</option>
                                    <option value="Fullstack">Fullstack Development</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Data Science">Data Science</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Level</label>
                                <select name="level" className="w-full bg-page border border-ui rounded-lg px-4 py-3 text-primary focus:ring-2 focus:ring-theme outline-none">
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                                <textarea required name="description" rows="3" className="w-full bg-page border border-ui rounded-lg px-4 py-3 text-primary focus:ring-2 focus:ring-theme outline-none" placeholder="What will students learn?"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3 rounded-lg transition shadow-sm">
                                Create Class
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Curriculum Builder Overlay */}
            {editingCourse && (
                <CurriculumBuilder
                    courseId={editingCourse._id}
                    initialModules={editingCourse.modules}
                    initialSyllabus={editingCourse.syllabus}
                    initialTitle={editingCourse.title}
                    initialDescription={editingCourse.description}
                    onClose={() => setEditingCourse(null)}
                    onSave={() => {
                        setEditingCourse(null);
                        fetchCourses();
                    }}
                />
            )}
            {replyingDoubt && (
                <DoubtReplyModal
                    doubt={replyingDoubt}
                    onClose={() => setReplyingDoubt(null)}
                    onReplySuccess={() => {
                        fetchDoubts();
                        fetchOverviewData();
                    }}
                />
            )}
            {managingStudentsCourse && (
                <ManageStudentsModal
                    course={managingStudentsCourse}
                    onClose={() => setManagingStudentsCourse(null)}
                    onUpdate={() => {
                        fetchCourses();
                        setManagingStudentsCourse(null);
                    }}
                />
            )}
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, iconColor, iconBg }) => (
    <motion.div
        variants={fadeUp}
        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.07)' }}
        className="bg-surface p-6 rounded-none border border-ui-light shadow-sm cursor-default transition-all duration-300"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-none ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
        </div>
        <p className="text-xs font-bold text-muted-clr uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-black text-primary tracking-tight">{value}</h3>
    </motion.div>
);

export default TeacherDashboard;

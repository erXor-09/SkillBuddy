import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, User, Lock, Eye, EyeOff, Brain, ArrowRight, GraduationCap, School } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const { darkMode } = useTheme();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            navigate('/login', {
                state: {
                    email: formData.email,
                    requiresOtp: true,
                    message: 'Registration successful! Please check your email for the verification code.'
                }
            });
        } catch (err) {
            if (err.response?.data?.error === 'Email already registered') {
                setError('Email already registered. Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(err.response?.data?.error || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden" style={{ background: darkMode ? '#0F1117' : '#F9FAFB' }}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-light rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-light rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg rounded-none p-8 shadow-xl relative z-10"
                style={{ background: darkMode ? '#1A1D27' : '#FFFFFF', border: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}` }}
            >
                <div className="flex justify-between items-center mb-6">
                    <Link to="/" className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>
                        <ChevronLeft size={16} /> Back
                    </Link>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Brain className="w-6 h-6 text-theme" />
                            <span className="font-black tracking-tight" style={{ color: darkMode ? '#F1F5F9' : '#111827' }}>SkillBuddy</span>
                        </Link>
                    </div>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight" style={{ color: darkMode ? '#F1F5F9' : '#111827' }}>Create Account</h1>
                    <p style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>Join the platform building the future of learning.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-none text-sm font-medium">
                            {error}
                        </motion.div>
                    )}

                    {/* Role Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-2">
                        <button type="button" onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`p-4 rounded-none border transition-all flex flex-col items-center gap-2 font-bold text-sm
                                ${formData.role === 'student' ? 'bg-theme text-white border-theme shadow-lg' : 'bg-page border-ui text-secondary hover:bg-surface-2'}`}>
                            <GraduationCap size={24} />
                            Student
                        </button>
                        <button type="button" onClick={() => setFormData({ ...formData, role: 'teacher' })}
                            className={`p-4 rounded-none border transition-all flex flex-col items-center gap-2 font-bold text-sm
                                ${formData.role === 'teacher' ? 'bg-theme text-white border-theme shadow-lg' : 'bg-page border-ui text-secondary hover:bg-surface-2'}`}>
                            <School size={24} />
                            Teacher
                        </button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                                className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                placeholder="John Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required
                                className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                placeholder="name@example.com" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                            <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required
                                className="w-full pl-12 pr-12 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-3.5 text-muted-clr hover:text-primary transition-colors">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 shadow-lg">
                        {loading ? 'Creating...' : 'Create Account'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-secondary text-sm">
                        Already have an account? <Link to="/login" className="text-theme font-bold hover:text-theme-hover">Log in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, verifyOtp, resendOtp, user, logout } = useAuth();
    const { darkMode } = useTheme();

    const [email, setEmail] = useState(location.state?.email || '');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(location.state?.message || '');
    const [loading, setLoading] = useState(false);
    const [requiresOtp, setRequiresOtp] = useState(location.state?.requiresOtp || false);

    if (user && !requiresOtp) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: darkMode ? '#0F1117' : '#F9FAFB' }}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-theme-light rounded-full blur-3xl opacity-40 pointer-events-none"></div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-surface border border-ui rounded-none p-8 shadow-xl relative z-10 text-center"
                >
                    <div className="w-20 h-20 bg-theme rounded-full mx-auto flex items-center justify-center text-3xl font-black text-white mb-4">
                        {user.name ? user.name[0] : 'U'}
                    </div>
                    <h2 className="text-2xl font-black mb-2 text-primary">Welcome back, {user.name}</h2>
                    <p className="text-secondary mb-8">You are signed in as <span className="text-primary font-semibold">{user.email}</span></p>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            Continue to Dashboard <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => logout()}
                            className="w-full bg-surface text-primary font-bold py-3.5 rounded-none hover:bg-page transition-all border border-ui"
                        >
                            Switch Account
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            if (requiresOtp) {
                await verifyOtp(email, otp);
                navigate('/dashboard');
            } else {
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.isEmailVerified === false) {
                setRequiresOtp(true);
                setError('Please verify your email with the OTP sent.');
                try { await resendOtp(email); } catch { }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);
            await resendOtp(email);
            setSuccess('Verification code resent to your email.');
            setError('');
        } catch {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden" style={{ background: darkMode ? '#0F1117' : '#F9FAFB' }}>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-light rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-light rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md rounded-none p-8 shadow-xl relative z-10"
                style={{ background: darkMode ? '#1A1D27' : '#FFFFFF', border: `1px solid ${darkMode ? '#2D3249' : '#E5E7EB'}` }}
            >
                <div className="flex justify-between items-center mb-8">
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
                    <h1 className="text-3xl font-black mb-2 tracking-tight text-primary">{requiresOtp ? 'Verify Access' : 'Welcome Back'}</h1>
                    <p className="text-secondary">{requiresOtp ? 'Enter the security code sent to your email.' : 'Enter your credentials to continue.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {success && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-none text-sm font-medium">
                            {success}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-none text-sm font-medium">
                            {error}
                        </motion.div>
                    )}

                    {!requiresOtp ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-secondary">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                    <input
                                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                        className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-secondary">Password</label>
                                    <Link to="/forgot-password" className="text-xs font-bold text-theme hover:text-theme-hover">Forgot?</Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                                        className="w-full pl-12 pr-12 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-muted-clr hover:text-primary transition-colors">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary">Verification Code</label>
                            <input
                                type="text" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required
                                className="w-full px-4 py-4 bg-page border border-ui rounded-none text-primary text-center text-3xl font-mono tracking-[0.5em] focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                placeholder="000000"
                            />
                            <div className="text-right">
                                <button type="button" onClick={handleResendOtp} disabled={loading}
                                    className="text-sm text-theme hover:text-theme-hover font-bold transition-colors">
                                    Resend Code
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                        {loading ? 'Processing...' : (requiresOtp ? 'Verify & Continue' : 'Sign In')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                {!requiresOtp && (
                    <div className="mt-8 text-center">
                        <p className="text-secondary text-sm">
                            New to SkillBuddy? <Link to="/register" className="text-theme font-bold hover:text-theme-hover">Create an account</Link>
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Login;

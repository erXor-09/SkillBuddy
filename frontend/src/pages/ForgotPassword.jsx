import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Key, ArrowRight, Eye, EyeOff, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { forgotPassword, resetPassword } = useAuth();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        try {
            await forgotPassword(email);
            setMessage('Reset code sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset code.');
        } finally { setLoading(false); }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true); setError(''); setMessage('');
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        try {
            await resetPassword(email, otp, newPassword);
            setMessage('Password reset successful! Redirecting...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-page flex items-center justify-center p-4 font-sans relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-light rounded-full blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-theme-light rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-surface border border-ui rounded-none p-8 shadow-xl relative z-10"
            >
                <div className="flex justify-between items-center mb-8">
                    <Link to="/login" className="text-secondary hover:text-primary transition-colors flex items-center gap-2 text-sm font-semibold">
                        <ChevronLeft size={16} /> Back to Login
                    </Link>
                    <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Brain className="w-6 h-6 text-theme" />
                        <span className="font-black tracking-tight text-primary">SkillBuddy</span>
                    </Link>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2 tracking-tight text-primary">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h1>
                    <p className="text-secondary">
                        {step === 1
                            ? "Enter your email and we'll send you a recovery code."
                            : "Enter the code and your new password."}
                    </p>
                </div>

                {message && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-none text-sm font-medium mb-6">
                        {message}
                    </motion.div>
                )}
                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-none text-sm font-medium mb-6">
                        {error}
                    </motion.div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                    className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                    placeholder="name@example.com" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                            {loading ? 'Sending...' : 'Send Reset Code'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary">Verification Code</label>
                            <div className="relative group">
                                <Key className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
                                    className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                    placeholder="Enter 6-digit code" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                                    className="w-full pl-12 pr-12 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                    placeholder="New password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-muted-clr hover:text-primary transition-colors">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-muted-clr group-focus-within:text-theme transition-colors" />
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                    className="w-full pl-12 pr-4 py-3 bg-page border border-ui rounded-none text-primary placeholder-gray-400 focus:outline-none focus:border-theme focus:ring-1 focus:ring-theme transition-all"
                                    placeholder="Confirm new password" />
                            </div>
                        </div>
                        <button type="submit" disabled={loading}
                            className="w-full bg-theme hover:bg-theme-hover text-white font-bold py-3.5 rounded-none transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg">
                            {loading ? 'Resetting...' : 'Reset Password'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;

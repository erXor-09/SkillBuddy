import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Mail, Lock, Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SkillBuddyLogo = () => (
    <div className="flex items-center space-x-2 text-white">
        <Brain className="h-8 w-8 text-purple-400" />
        <span className="text-2xl font-bold">SkillBuddy</span>
    </div>
);

const Login = () => {
    const navigate = useNavigate();
    const { login, verifyOtp } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requiresOtp, setRequiresOtp] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (requiresOtp) {
                await verifyOtp(email, otp);
                navigate('/dashboard'); // Will redirect based on role in Dashboard or AuthContext
            } else {
                await login(email, password);
                navigate('/dashboard');
            }
        } catch (err) {
            if (err.response?.status === 403 && err.response?.data?.isEmailVerified === false) {
                setRequiresOtp(true);
                setError('Please verify your email with the OTP sent.');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <Link to="/" className="text-gray-400 hover:text-white mb-4 block">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <div className="flex justify-center mb-6"><SkillBuddyLogo /></div>
                <h2 className="text-3xl font-bold text-white text-center mb-2">{requiresOtp ? 'Verify Email' : 'Welcome Back'}</h2>

                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

                    {!requiresOtp ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required placeholder="Enter your email" />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        required
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end mb-6">
                                <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">Forgot Password?</Link>
                            </div>
                        </>
                    ) : (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500"
                                maxLength={6}
                                required
                                placeholder="000000"
                            />
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg disabled:opacity-50">
                        {loading ? (requiresOtp ? 'Verifying...' : 'Logging in...') : (requiresOtp ? 'Verify' : 'Login')}
                    </button>
                </form>

                {!requiresOtp && (
                    <div className="mt-6 text-center text-gray-400">
                        Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300 font-bold">Sign Up</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;

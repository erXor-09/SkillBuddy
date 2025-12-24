import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SkillBuddyLogo = () => (
    <div className="flex items-center space-x-2 text-white">
        <Brain className="h-8 w-8 text-purple-400" />
        <span className="text-2xl font-bold">SkillBuddy</span>
    </div>
);

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            alert('Registration successful! Please check your email for the OTP.');
            navigate('/login'); // Should actually trigger the verify state in login or separate verify page
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <Link to="/" className="text-gray-400 hover:text-white mb-4 block"><ChevronLeft className="w-6 h-6" /></Link>
                <div className="flex justify-center mb-6"><SkillBuddyLogo /></div>
                <h2 className="text-3xl font-bold text-white text-center mb-2">Get Started</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
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
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">I am a</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" onClick={() => setFormData({ ...formData, role: 'student' })} className={`p-4 rounded-lg border-2 transition ${formData.role === 'student' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'}`}>Student</button>
                            <button type="button" onClick={() => setFormData({ ...formData, role: 'teacher' })} className={`p-4 rounded-lg border-2 transition ${formData.role === 'teacher' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300'}`}>Teacher</button>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg disabled:opacity-50">
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;

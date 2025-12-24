import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Play, Brain, BarChart, Globe, Zap, CheckCircle, ArrowRight, User, Settings, Phone, Mail } from 'lucide-react';

const SkillBuddyLogo = () => (
    <div className="flex items-center space-x-2 text-white">
        <Brain className="h-8 w-8 text-blue-400" />
        <span className="text-2xl font-bold tracking-tight">SkillBuddy</span>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0f0c29] text-white font-sans selection:bg-blue-500/30">

            {/* --- Hero Section --- */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1c2e] via-[#302b63] to-[#24243e]">
                {/* Navbar */}
                <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-10">
                    <SkillBuddyLogo />
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
                        <a href="#features" className="hover:text-blue-400 transition">Features</a>
                        <a href="#how-it-works" className="hover:text-blue-400 transition">How it Works</a>
                        <a href="#" className="hover:text-blue-400 transition">Pricing</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#00d084] hover:bg-[#00b070] text-gray-900 px-6 py-2.5 rounded-lg font-bold transition shadow-[0_0_15px_rgba(0,208,132,0.3)]"
                        >
                            Sign In
                        </button>
                    </div>
                </nav>

                {/* Hero Content */}
                <main className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10"></div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                        Learn Smarter, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Not Harder</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        Experience truly personalized learning with AI-powered courses, real-time progress
                        tracking, and adaptive content that evolves with your learning style.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center transition-all hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                        >
                            Start Learning Free <ChevronRight className="ml-2 w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 rounded-xl font-bold text-lg flex items-center border border-gray-600 hover:bg-white/5 transition hover:border-gray-400">
                            <Play className="mr-2 w-5 h-5 fill-current" /> Watch Demo
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { val: "50K+", label: "Active Learners" },
                            { val: "200+", label: "Courses Available" },
                            { val: "95%", label: "Success Rate" },
                            { val: "24/7", label: "AI Support" }
                        ].map((stat, idx) => (
                            <div key={idx} className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/10 transition">
                                <div className="text-3xl font-bold text-white mb-1">{stat.val}</div>
                                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* --- Features Section --- */}
            <section id="features" className="py-24 bg-[#0f0c29] relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose SkillBuddy?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Our platform combines cutting-edge AI with proven pedagogical methods to create
                            the ultimate learning experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-blue-500/30 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors duration-500">
                                <Brain className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI-Powered Personalization</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Our AI analyzes your learning patterns and adapts content difficulty, pace, and style to match your unique needs.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors duration-500">
                                <BarChart className="w-7 h-7 text-purple-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Real-Time Progress Tracking</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Monitor your learning journey with detailed analytics, identifying strengths and areas for improvement instantly.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 hover:border-green-500/30 transition-all duration-300 group">
                            <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors duration-500">
                                <Globe className="w-7 h-7 text-green-400 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Multi-Language Support</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Learn in your native language with real-time translation of text and video content for deeper understanding.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#0f0c29] to-[#1a1c2e]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
                        <p className="text-gray-400">Get started in minutes with our simple, yet powerful learning process.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 border-t border-dashed border-gray-600/50 -z-0"></div>

                        {[
                            { step: "01", title: "Choose Your Field", desc: "Select from programming, design, business, and more." },
                            { step: "02", title: "Take Assessment", desc: "Answer 5-10 questions to determine your current level." },
                            { step: "03", title: "Get Custom Plan", desc: "Receive a personalized learning path tailored to your needs." },
                            { step: "04", title: "Start Learning", desc: "Begin your journey with adaptive content and real-time feedback." }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-24 h-24 rounded-full bg-[#1a1c2e] border-4 border-[#252846] flex items-center justify-center mb-8 shadow-xl group-hover:border-blue-500 transition-colors duration-500">
                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                                <p className="text-sm text-gray-400 px-4">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-800 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Learning?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of learners who are already experiencing personalized education.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:scale-105 transition-transform duration-300"
                    >
                        Get Started Today
                    </button>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-[#0b0a1f] pt-20 pb-10 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        {/* Brand */}
                        <div>
                            <SkillBuddyLogo />
                            <p className="text-gray-500 mt-6 text-sm leading-relaxed">
                                Empowering learners worldwide with AI-driven personalized education.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h4 className="font-bold mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Support</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition">Help Center</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-blue-400 transition">About</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} SkillBuddy. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default LandingPage;

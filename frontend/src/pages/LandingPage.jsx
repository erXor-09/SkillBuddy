import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Play, Brain, BarChart, Globe, MapPin, Star, Users, CheckCircle, ArrowUp, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const SkillBuddyLogo = () => (
    <Link to="/" className="flex items-center space-x-2 text-primary hover:opacity-90 transition-opacity">
        <Brain className="h-8 w-8 text-theme" />
        <span className="text-2xl font-bold tracking-tight">SkillBuddy</span>
    </Link>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentTheme, setCurrentTheme, THEMES, darkMode } = useTheme();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    return (
        <div
            className="min-h-screen font-sans selection:bg-theme-light selection:text-theme"
            style={{ background: darkMode ? '#0F1117' : '#F9FAFB', color: darkMode ? '#F1F5F9' : '#111827' }}
        >

            {/* --- Navigation Bar --- */}
            <nav className="container mx-auto px-6 py-6 flex items-center justify-between relative z-50">
                <SkillBuddyLogo />

                <div className="hidden md:flex items-center space-x-8 text-sm font-medium" style={{ color: darkMode ? '#94A3B8' : '#6B7280' }}>
                    <a href="#features" className="hover:text-theme transition-colors">Features</a>
                    <a href="#how-it-works" className="hover:text-theme transition-colors">How it Works</a>
                    <a href="#" className="hover:text-theme transition-colors">Pricing</a>

                    {/* Theme controls */}
                    <div className="border-l pl-6 ml-2 flex items-center" style={{ borderColor: darkMode ? '#2D3249' : '#E5E7EB' }}>
                        <ThemeToggle />
                    </div>

                    {user ? (
                        <button
                            onClick={() => navigate(user?.role === 'teacher' ? '/teacher/overview' : '/student/overview')}
                            className="flex items-center gap-2 bg-surface hover:bg-theme-light border border-ui px-4 py-2 rounded-full transition-all group shadow-sm"
                        >
                            <div className="w-8 h-8 rounded-full bg-theme flex items-center justify-center text-xs font-bold text-white uppercase">
                                {user.name ? user.name[0] : 'U'}
                            </div>
                            <span className="text-primary font-semibold group-hover:text-theme transition-colors">
                                {user.name}
                            </span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary hover:text-theme font-bold transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-theme hover:bg-theme-hover text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <main className="container mx-auto px-6 pt-12 pb-24 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Left: Text Content */}
                    <motion.div
                        className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-theme-light text-theme font-semibold text-sm mb-6 border border-theme/20">
                            ✨ The Future of Learning
                        </motion.div>
                        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight leading-[1.1] text-primary">
                            Learn Smarter, <br /><span className="text-theme">Not Harder.</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-secondary mb-10 leading-relaxed max-w-xl font-medium">
                            Experience truly personalized learning with AI-powered courses, real-time progress tracking, and adaptive content that evolves with you.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={() => navigate(user ? (user?.role === 'teacher' ? '/teacher/overview' : '/student/overview') : '/register')}
                                className="w-full sm:w-auto bg-theme hover:bg-theme-hover text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center transition-all shadow-xl shadow-theme/30 hover:shadow-theme/40 hover:-translate-y-1"
                            >
                                {user ? 'Go to Dashboard' : 'Start Learning Free'} <ChevronRight className="ml-2 w-5 h-5" />
                            </button>
                            <button className="w-full sm:w-auto bg-surface px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center border border-ui hover:bg-page transition-all shadow-sm hover:shadow-md text-primary">
                                <div className="w-8 h-8 rounded-full bg-theme-light flex items-center justify-center mr-3">
                                    <Play className="w-4 h-4 text-theme fill-current" />
                                </div>
                                How it works
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Right: Visual Content (Floating Orbit Cards) */}
                    <motion.div
                        className="lg:w-1/2 relative h-[500px] w-full max-w-md mx-auto"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                        {/* Background structural blob */}
                        <div className="absolute inset-0 bg-theme-light rounded-none rotate-6 transform-gpu"></div>
                        <div className="absolute inset-0 bg-surface border border-ui-light rounded-none -rotate-3 overflow-hidden shadow-2xl flex flex-col">
                            {/* Fake App Mockup */}
                            <div className="h-16 border-b border-ui-light flex items-center px-6 gap-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 bg-page rounded-full h-8 flex items-center px-4">
                                    <div className="w-4 h-4 rounded-full bg-gray-200 mr-2"></div>
                                    <div className="w-24 h-2 bg-gray-200 rounded-full"></div>
                                </div>
                            </div>
                            <div className="p-6 flex-1 bg-page relative overflow-hidden">
                                <div className="w-3/4 h-8 bg-gray-200 rounded-none mb-6"></div>
                                <div className="flex gap-4 mb-6">
                                    <div className="w-1/2 h-32 bg-theme-light rounded-none flex items-center justify-center">
                                        <BarChart className="w-10 h-10 text-theme opacity-50" />
                                    </div>
                                    <div className="w-1/2 h-32 bg-surface shadow-sm border border-ui-light rounded-none"></div>
                                </div>
                                <div className="w-full h-24 bg-surface shadow-sm border border-ui-light rounded-none mb-4"></div>
                                <div className="w-full h-24 bg-surface shadow-sm border border-ui-light rounded-none"></div>
                            </div>
                        </div>

                        {/* Floating Cards (Framer Motion) */}
                        <motion.div
                            className="absolute -top-6 -left-12 bg-surface p-4 rounded-none shadow-xl border border-ui-light flex items-center gap-4 z-20"
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-12 h-12 rounded-full bg-theme flex items-center justify-center">
                                <span className="text-white font-bold text-xl">95%</span>
                            </div>
                            <div>
                                <p className="font-bold text-primary">Success Rate</p>
                                <p className="text-sm text-secondary">Active Learners</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute top-1/2 -right-16 bg-surface p-4 rounded-none shadow-xl border border-ui-light w-48 z-20"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Brain className="text-theme w-5 h-5" />
                                <span className="font-bold text-sm">AI Personalized</span>
                            </div>
                            <div className="w-full bg-surface-2 rounded-full h-2 mb-2">
                                <div className="bg-theme h-2 rounded-full w-3/4"></div>
                            </div>
                            <p className="text-xs text-secondary">Adapts to your pace</p>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-8 left-10 bg-surface p-3 rounded-full shadow-lg border border-ui-light flex items-center gap-2 z-20 pr-6"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <div className="flex -space-x-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">A</div>
                                <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-600">B</div>
                                <div className="w-10 h-10 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-600">C</div>
                            </div>
                            <span className="text-sm font-bold text-primary ml-2">50k+ Students</span>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* --- Stats Ticker --- */}
            <div className="border-y border-ui bg-surface py-8 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-24">
                        {[
                            { icon: <MapPin className="w-6 h-6" />, label: "Available in 150+ Countries", x: -60 },
                            { icon: <Star className="w-6 h-6" />, label: "4.9/5 Average Rating", x: 0 },
                            { icon: <Users className="w-6 h-6" />, label: "Trusted by 50,000+ Users", x: 60 }
                        ].map((stat, idx) => (
                            <motion.div
                                key={idx}
                                className="flex items-center gap-3 text-secondary font-medium"
                                initial={{ opacity: 0, x: stat.x }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.1 }}
                            >
                                <div className="text-theme">{stat.icon}</div>
                                <span>{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Features Section --- */}
            <section id="features" className="py-24 bg-page">
                <div className="container mx-auto px-6">
                    <motion.div
                        className="text-center mb-16 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">Why Choose SkillBuddy?</h2>
                        <p className="text-secondary text-lg leading-relaxed">
                            Our platform combines cutting-edge AI with proven pedagogical methods to create the ultimate learning experience.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Brain />, title: "AI-Powered Paths", desc: "Our AI analyzes your learning patterns and adapts content difficulty, pace, and style." },
                            { icon: <BarChart />, title: "Real-Time Analytics", desc: "Monitor your learning journey with detailed analytics, identifying strengths instantly." },
                            { icon: <Globe />, title: "Multi-Language", desc: "Learn in your native language with real-time translation of text and video content." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-surface p-8 rounded-none shadow-sm border border-ui-light hover:shadow-xl hover:-translate-y-1 transition-all group"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.15 }}
                            >
                                <div className="w-16 h-16 bg-theme-light rounded-none flex items-center justify-center mb-6 group-hover:bg-theme transition-colors duration-300">
                                    <div className="text-theme group-hover:text-white transition-colors w-8 h-8 flex items-center justify-center">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-primary">{feature.title}</h3>
                                <p className="text-secondary leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section id="how-it-works" className="py-24 bg-surface relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto overflow-hidden">
                        <motion.h2
                            className="text-3xl md:text-5xl font-bold mb-6 text-primary"
                            initial={{ opacity: 0, x: -80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        >
                            How It Works
                        </motion.h2>
                        <motion.p
                            className="text-secondary text-lg"
                            initial={{ opacity: 0, x: 80 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
                        >
                            Get started in minutes with our simple, yet powerful learning process.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-0.5 bg-surface-2 -z-0"></div>

                        {[
                            { step: "01", title: "Choose Field", desc: "Select from programming, design, business, and more." },
                            { step: "02", title: "Assessment", desc: "Answer a few questions to determine your level." },
                            { step: "03", title: "Custom Plan", desc: "Receive a personalized learning path tailored just for you." },
                            { step: "04", title: "Learn & Grow", desc: "Begin your journey with adaptive content and feedback." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                className="relative z-10 flex flex-col items-center text-center group"
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -60 : 60 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.65, ease: 'easeOut', delay: idx * 0.12 }}
                            >
                                <div className="w-24 h-24 rounded-full bg-surface border-4 border-ui-light flex items-center justify-center mb-6 shadow-sm group-hover:border-theme transition-colors duration-300">
                                    <span className="text-2xl font-black text-gray-300 group-hover:text-theme transition-colors">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-primary">{item.title}</h3>
                                <p className="text-sm text-secondary px-4">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-24 bg-theme relative overflow-hidden text-white">
                {/* Decorative blob */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-surface/10 blur-3xl rounded-full"></div>

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h2
                        className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight"
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        Transform Your Learning Today.
                    </motion.h2>
                    <motion.p
                        className="text-xl text-theme-light mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, x: 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
                    >
                        Join thousands of learners who are already experiencing personalized education tailored just for them. No credit card required.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
                    >
                        <button
                            onClick={() => navigate('/register')}
                            className="bg-surface text-theme px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform duration-300 inline-flex items-center"
                        >
                            Get Started for Free <ChevronRight className="ml-2 w-5 h-5" />
                        </button>
                        <ul className="flex flex-wrap justify-center gap-6 mt-10 text-theme-light font-medium">
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> 14-day free trial</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Cancel anytime</li>
                            <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> AI Personalized</li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="bg-surface border-t border-ui pt-20 pb-10 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-theme to-transparent opacity-20"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                        <motion.div
                            className="md:col-span-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <SkillBuddyLogo />
                            <p className="text-secondary mt-6 text-sm leading-relaxed max-w-sm">
                                Empowering learners worldwide with AI-driven personalized education. Transforming the way you acquire new skills, one interactive lesson at a time.
                            </p>
                            <div className="flex items-center gap-4 mt-6">
                                {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-surface-2 border border-ui flex items-center justify-center text-secondary hover:text-theme hover:border-theme hover:bg-theme-light transition-all duration-300">
                                        <Icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Platform",
                                    links: ["Features", "Pricing", "API", "Integrations", "Status"]
                                },
                                {
                                    title: "Support",
                                    links: ["Help Center", "Contact", "Community", "Documentation"]
                                },
                                {
                                    title: "Company",
                                    links: ["About", "Blog", "Careers", "Press"]
                                }
                            ].map((column, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 * (idx + 1) }}
                                >
                                    <h4 className="font-bold mb-6 text-primary">{column.title}</h4>
                                    <ul className="space-y-4 text-sm text-secondary">
                                        {column.links.map((link, i) => (
                                            <li key={i}>
                                                <a href="#" className="hover:text-theme transition-colors relative group inline-block">
                                                    {link}
                                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-theme transition-all duration-300 group-hover:w-full"></span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        className="border-t border-ui-light pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-secondary"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p>&copy; {new Date().getFullYear()} SkillBuddy. All rights reserved.</p>

                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <a href="#" className="hover:text-theme transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-theme transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-theme transition-colors">Cookie Settings</a>
                        </div>

                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-surface-2 hover:bg-theme-light text-primary hover:text-theme border border-ui p-3 rounded-full transition-all duration-300 flex items-center justify-center group"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

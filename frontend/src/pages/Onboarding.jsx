import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Code, Zap, Globe, Database,
    Layout, Server, Smartphone, Cloud, Terminal, Cpu,
    Feather, Rocket, Trophy, Target, Loader2, Star, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

// --- Data Constants ---

const ROLE_BASED_ROADMAPS = [
    { id: 'frontend', title: 'Frontend', description: 'User interfaces & experience', icon: Layout, color: 'from-pink-500 to-rose-500' },
    { id: 'backend', title: 'Backend', description: 'Server logic & databases', icon: Server, color: 'from-blue-500 to-cyan-500' },
    { id: 'devops', title: 'DevOps', description: 'Deployment & infrastructure', icon: Cloud, color: 'from-green-500 to-emerald-500' },
    { id: 'fullstack', title: 'Full Stack', description: 'End-to-end development', icon: Globe, color: 'from-purple-500 to-violet-500' },
    { id: 'android', title: 'Android', description: 'Mobile apps for Android', icon: Smartphone, color: 'from-teal-500 to-green-400' },
    { id: 'ai-engineer', title: 'AI Engineer', description: 'Machine learning & models', icon: Cpu, color: 'from-orange-500 to-red-500' },
];

const SKILL_BASED_ROADMAPS = [
    { id: 'python', title: 'Python', icon: Terminal },
    { id: 'react', title: 'React', icon: Code },
    { id: 'java', title: 'Java', icon: Code },
    { id: 'docker', title: 'Docker', icon: Cloud },
    { id: 'sql', title: 'SQL', icon: Database },
];

const ONBOARDING_LEVELS = [
    { id: 'beginner', title: 'Beginner', icon: Feather, desc: 'Just starting out' },
    { id: 'intermediate', title: 'Intermediate', icon: Rocket, desc: 'Some experience' },
    { id: 'advanced', title: 'Advanced', icon: Zap, desc: 'Professional level' },
];

const ONBOARDING_GOALS = [
    { id: 'career', title: 'Career Change', icon: Trophy },
    { id: 'skill', title: 'Skill Upgrade', icon: Star },
    { id: 'personal', title: 'Personal Interest', icon: Target },
    { id: 'freelancing', title: 'Freelancing', icon: Globe },
];

// --- Components ---

const ProgressBar = ({ step, totalSteps }) => {
    const progress = (step / totalSteps) * 100;

    return (
        <div className="w-full max-w-xl mx-auto mb-12">
            <div className="flex justify-between text-xs font-bold text-muted-clr uppercase tracking-widest mb-3 px-1">
                <span>Start</span>
                <span>Finish</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-theme"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                />
            </div>
        </div>
    );
};

const Onboarding = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({ field: null, level: null, goals: [] });
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizError, setQuizError] = useState(null);
    const [quizResultSummary, setQuizResultSummary] = useState(null);

    const totalSteps = 6;

    // --- Actions ---

    const handleSelection = (id) => {
        setData({ ...data, field: id });
        nextStep();
    };

    const toggleGoal = (goalId) => {
        setData(prev => {
            const current = prev.goals || [];
            return current.includes(goalId)
                ? { ...prev, goals: current.filter(g => g !== goalId) }
                : { ...prev, goals: [...current, goalId] };
        });
    };

    const fetchAssessment = async () => {
        setQuizLoading(true);
        setQuizError(null);
        try {
            const fieldObj = [...ROLE_BASED_ROADMAPS, ...SKILL_BASED_ROADMAPS].find(f => f.id === data.field);
            const fieldTitle = fieldObj ? fieldObj.title : data.field;
            const levelTitle = ONBOARDING_LEVELS.find(l => l.id === data.level)?.title;

            const res = await api.post('/courses/onboarding-assessment', {
                field: fieldTitle,
                level: levelTitle
            });

            if (res.data.questions && res.data.questions.length > 0) {
                setQuizQuestions(res.data.questions);
            } else {
                throw new Error("No questions returned");
            }
        } catch (error) {
            console.error("Failed to load quiz", error);
            setQuizError("Failed to load assessment. Please try again.");
        } finally {
            setQuizLoading(false);
        }
    };

    const handleQuizSubmit = () => {
        if (quizQuestions.length === 0) return;

        let correctCount = 0;
        quizQuestions.forEach((q, i) => {
            if (q.options[quizAnswers[i]] === q.correctAnswer) correctCount++;
        });

        const percentage = (correctCount / quizQuestions.length) * 100;
        let feedback = "Great start! Learning is about the journey.";
        let recommendation = "We've added a strong foundational module to ensure you master the basics completely.";

        if (percentage >= 80) {
            feedback = "Outstanding! You have a strong grasp of the core concepts.";
            recommendation = "We're adjusting your plan to skip the basics and focus on advanced, high-impact topics.";
        } else if (percentage >= 50) {
            feedback = "Good work! You have a solid foundation to build upon.";
            recommendation = "We'll briefly review key concepts before diving into intermediate challenges.";
        }

        setQuizResultSummary({
            score: correctCount,
            total: quizQuestions.length,
            percentage,
            feedback,
            recommendation
        });

        setStep(5);
    };

    const handleFinalGenerate = async () => {
        setStep(6);
        setLoading(true);
        try {
            const fieldObj = [...ROLE_BASED_ROADMAPS, ...SKILL_BASED_ROADMAPS].find(f => f.id === data.field);
            const fieldTitle = fieldObj ? fieldObj.title : data.field;
            const levelTitle = ONBOARDING_LEVELS.find(l => l.id === data.level)?.title;
            const goalTitles = data.goals.map(g => ONBOARDING_GOALS.find(og => og.id === g)?.title).filter(Boolean);

            const payload = {
                field: fieldTitle,
                level: levelTitle,
                goals: goalTitles,
                quizResults: quizResultSummary
            };

            await api.post('/courses/generate-path', payload);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to generate learning path. Please try again.');
            setStep(5);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 3) fetchAssessment();
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // --- Renderers ---

    const renderDirectory = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-5xl mx-auto"
        >
            <h3 className="text-xl font-medium text-secondary mb-8 border-l-4 border-theme pl-4">Choose your Path</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {ROLE_BASED_ROADMAPS.map((role) => (
                    <motion.button
                        key={role.id}
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelection(role.id)}
                        className="group relative overflow-hidden bg-surface border border-ui-light rounded-2xl p-6 text-left transition-all hover:border-ui hover:shadow-xl shadow-sm"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 text-white shadow-lg`}>
                                <role.icon size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-primary mb-2">{role.title}</h4>
                            <p className="text-sm text-secondary group-hover:text-secondary transition-colors">{role.description}</p>
                        </div>
                    </motion.button>
                ))}
            </div>

            <h3 className="text-xl font-medium text-secondary mb-6 border-l-4 border-blue-500 pl-4">Or Master a Skill</h3>
            <div className="flex flex-wrap gap-3">
                {SKILL_BASED_ROADMAPS.map((skill) => (
                    <motion.button
                        key={skill.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSelection(skill.id)}
                        className="bg-surface border border-ui rounded-lg px-6 py-3 font-medium text-secondary hover:text-theme hover:bg-theme-light hover:border-theme/20 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <skill.icon size={18} className="text-blue-500" />
                        {skill.title}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const renderLevelSelection = () => (
        <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
            {ONBOARDING_LEVELS.map((level) => (
                <motion.button
                    key={level.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setData({ ...data, level: level.id })}
                    className={`relative p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300 overflow-hidden ${data.level === level.id
                        ? 'border-theme bg-theme-light text-primary shadow-xl'
                        : 'border-ui bg-surface text-secondary hover:border-gray-300 hover:shadow-md'
                        }`}
                >
                    <div className={`p-4 rounded-full mb-2 ${data.level === level.id ? 'bg-surface' : 'bg-surface-2'}`}>
                        <level.icon size={32} className={data.level === level.id ? 'text-theme' : 'text-muted-clr'} />
                    </div>
                    <span className="text-2xl font-bold">{level.title}</span>
                    <p className="text-sm opacity-70">{level.desc}</p>
                    {data.level === level.id && (
                        <motion.div layoutId="check" className="absolute top-4 right-4 text-theme">
                            <Check size={24} />
                        </motion.div>
                    )}
                </motion.button>
            ))}
        </motion.div>
    );

    const renderGoalSelection = () => (
        <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto"
        >
            {ONBOARDING_GOALS.map((goal) => (
                <motion.button
                    key={goal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-6 rounded-xl border flex items-center gap-4 text-left transition-all duration-200 ${data.goals.includes(goal.id)
                        ? 'border-theme bg-theme-light text-primary shadow-lg'
                        : 'border-ui bg-surface text-secondary hover:border-gray-300 hover:shadow-md'
                        }`}
                >
                    <div className={`p-3 rounded-lg ${data.goals.includes(goal.id) ? 'bg-theme text-white' : 'bg-surface-2 text-muted-clr'}`}>
                        <goal.icon size={24} />
                    </div>
                    <div>
                        <span className="text-lg font-bold block">{goal.title}</span>
                        <span className="text-xs opacity-60">Click to select</span>
                    </div>
                </motion.button>
            ))}
        </motion.div>
    );

    const renderQuiz = () => {
        if (quizLoading) return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-12 h-12 text-theme animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-primary mb-2">Analyzing your profile...</h3>
                <p className="text-secondary">Generating a custom diagnostic assessment.</p>
            </div>
        );

        if (quizError) return (
            <div className="text-center py-10">
                <div className="text-red-500 mb-6 text-lg bg-red-50 p-4 rounded-xl border border-red-200 inline-block">{quizError}</div>
                <button onClick={fetchAssessment} className="px-6 py-2 bg-surface-2 rounded-lg hover:bg-gray-200 text-primary font-medium transition-colors">
                    Try Again
                </button>
            </div>
        );

        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-6 max-w-3xl mx-auto"
            >
                <div className="bg-theme-light border border-theme/20 p-6 rounded-2xl flex items-center gap-4 mb-8">
                    <div className="p-3 bg-theme/10 rounded-full text-theme">
                        <Zap size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-primary">Diagnostic Assessment</h3>
                        <p className="text-sm text-secondary">Answer honestly so we can tailor your learning path perfectly.</p>
                    </div>
                </div>

                {quizQuestions.map((q, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className="bg-surface border border-ui-light p-8 rounded-2xl relative overflow-hidden shadow-sm"
                    >
                        <span className="absolute top-0 left-0 bg-page px-4 py-1 rounded-br-xl text-xs font-bold text-muted-clr">Question {index + 1}</span>
                        <p className="text-xl font-medium text-primary mb-6 mt-4">{q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((option, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => setQuizAnswers({ ...quizAnswers, [index]: optIdx })}
                                    className={`p-4 rounded-xl text-left transition-all font-medium ${quizAnswers[index] === optIdx
                                        ? 'bg-theme text-white shadow-lg ring-1 ring-theme'
                                        : 'bg-page text-secondary hover:bg-surface-2 hover:text-primary'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        );
    };

    const renderAnalysis = () => (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-6"
        >
            <div className="w-full max-w-2xl bg-surface border border-ui-light rounded-3xl p-10 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-theme"></div>

                <div className="mb-6 inline-flex p-4 rounded-full bg-amber-50 border border-amber-200 text-amber-500 animate-pulse">
                    <Trophy className="w-16 h-16" />
                </div>

                <h2 className="text-3xl font-black text-primary mb-2">Analysis Complete</h2>
                <div className="text-7xl font-black text-theme mb-8 tracking-tighter">
                    {quizResultSummary.score}<span className="text-4xl text-muted-clr font-medium">/{quizResultSummary.total}</span>
                </div>

                <div className="bg-page rounded-2xl p-8 mb-8 text-left border border-ui-light">
                    <div className="mb-6">
                        <h4 className="flex items-center text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
                            <Zap className="w-4 h-4 mr-2" /> Performance Feedback
                        </h4>
                        <p className="text-lg text-primary leading-relaxed">{quizResultSummary.feedback}</p>
                    </div>
                    <div>
                        <h4 className="flex items-center text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
                            <Target className="w-4 h-4 mr-2" /> Recommended Strategy
                        </h4>
                        <p className="text-lg text-secondary italic">
                            "{quizResultSummary.recommendation}"
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinalGenerate}
                    className="w-full py-4 bg-theme hover:bg-theme-hover rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 group"
                >
                    Generate Custom Roadmap
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>
        </motion.div>
    );

    const renderGenerating = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-10">
                <div className="absolute inset-0 bg-theme blur-3xl opacity-10 rounded-full animate-pulse"></div>
                <Loader2 className="w-24 h-24 text-theme animate-spin relative z-10" />
            </div>
            <h2 className="text-4xl font-black text-primary mb-6">Crafting Your Journey</h2>
            <div className="flex flex-col gap-3 text-secondary text-lg max-w-md mx-auto">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-3">
                    <Check className="text-emerald-500" size={20} /> Analyzing skill gaps...
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex items-center gap-3">
                    <Check className="text-emerald-500" size={20} /> Structuring modules...
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="flex items-center gap-3">
                    <Check className="text-emerald-500" size={20} /> Finalizing resources...
                </motion.div>
            </div>
        </div>
    );

    // --- Main Render ---

    return (
        <div className="min-h-screen bg-page text-primary flex flex-col font-sans overflow-x-hidden">

            {/* Header / Nav */}
            <div className="w-full p-6 flex justify-between items-center max-w-7xl mx-auto z-10 relative">
                <div className="text-2xl font-bold tracking-tighter flex items-center gap-2" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="w-8 h-8 rounded-lg bg-theme"></div>
                    SkillBuddy
                </div>
                {step > 1 && step < 6 && (
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-muted-clr hover:text-primary transition-colors">
                        Skip to Dashboard
                    </button>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col items-center px-4 md:px-6 py-8 relative">

                {/* Background Blobs */}
                <div className="absolute top-20 left-10 w-96 h-96 bg-theme-light rounded-full blur-[100px] pointer-events-none opacity-50"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

                {step === 6 ? null : (
                    <div className="text-center mb-10 z-10">
                        <motion.h1
                            key={`h1-${step}`}
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-primary"
                        >
                            {step === 1 && "What's your focus?"}
                            {step === 2 && "What's your experience level?"}
                            {step === 3 && "What are your goals?"}
                            {step === 4 && "Quick Knowledge Check"}
                            {step === 5 && "Assessment Complete"}
                        </motion.h1>
                        <motion.p
                            key={`p-${step}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-secondary text-lg max-w-2xl mx-auto"
                        >
                            {step === 1 && "Select a role path or specific skill to begin your personalized learning journey."}
                            {step === 2 && "We'll adapt the curriculum difficulty to match your current expertise."}
                            {step === 3 && "Tell us why you're learning so we can prioritize the most relevant content."}
                            {step === 4 && "A few quick questions to verify your starting point (and skip the boring stuff)."}
                        </motion.p>
                    </div>
                )}

                {step > 1 && step < 6 && <ProgressBar step={step - 1} totalSteps={5} />}

                <div className="w-full max-w-6xl z-10 min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && renderDirectory()}
                        {step === 2 && renderLevelSelection()}
                        {step === 3 && renderGoalSelection()}
                        {step === 4 && renderQuiz()}
                        {step === 5 && renderAnalysis()}
                        {step === 6 && renderGenerating()}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                {step > 1 && step < 5 && (
                    <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent z-20">
                        <div className="max-w-4xl mx-auto flex justify-between items-center">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 rounded-xl font-bold flex items-center text-secondary hover:text-primary hover:bg-surface-2 transition"
                            >
                                <ChevronLeft className="mr-2 w-5 h-5" /> Back
                            </button>

                            <button
                                onClick={step === 4 ? handleQuizSubmit : nextStep}
                                disabled={
                                    (step === 2 && !data.level) ||
                                    (step === 3 && data.goals.length === 0) ||
                                    (step === 4 && Object.keys(quizAnswers).length < quizQuestions.length)
                                }
                                className={`px-8 py-3 rounded-xl font-bold flex items-center shadow-lg transition-all ${(step === 4)
                                    ? 'bg-theme text-white hover:bg-theme-hover hover:scale-105'
                                    : 'bg-theme text-white hover:bg-theme-hover hover:scale-105'
                                    } disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                            >
                                {step === 4 ? (
                                    <>Show Results <Trophy className="ml-2 w-5 h-5" /></>
                                ) : (
                                    <>Next <ChevronRight className="ml-2 w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;

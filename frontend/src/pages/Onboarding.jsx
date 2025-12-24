import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Code, PenTool, BarChart, Globe, Database, Music, Camera, Briefcase, Feather, Rocket, Zap, Loader, CheckCircle, RefreshCw, Layers, Trophy, Target, AlertCircle, Server, Layout, Smartphone, Cloud, Terminal, Cpu } from 'lucide-react';
import api from '../api/axios';

// Roadmap.sh style roles
const ROLE_BASED_ROADMAPS = [
    { id: 'frontend', title: 'Frontend', description: 'User interfaces and experience', icon: Layout, color: 'bg-yellow-500' },
    { id: 'backend', title: 'Backend', description: 'Server logic and databases', icon: Server, color: 'bg-blue-500' },
    { id: 'devops', title: 'DevOps', description: 'Deployment and infrastructure', icon: Cloud, color: 'bg-green-500' },
    { id: 'fullstack', title: 'Full Stack', description: 'End-to-end development', icon: Layers, color: 'bg-purple-500' },
    { id: 'android', title: 'Android', description: 'Mobile apps for Android', icon: Smartphone, color: 'bg-teal-500' },
    { id: 'ai-engineer', title: 'AI Engineer', description: 'Machine learning and AI', icon: Cpu, color: 'bg-red-500' },
];

const SKILL_BASED_ROADMAPS = [
    { id: 'python', title: 'Python', icon: Terminal },
    { id: 'react', title: 'React', icon: Code },
    { id: 'java', title: 'Java', icon: Code },
    { id: 'docker', title: 'Docker', icon: boxIcon }, // Lucide doesn't have box, using generic or skipping icon
    { id: 'sql', title: 'SQL', icon: Database },
];

// Helper for skill icon since 'boxIcon' isn't real
function boxIcon(props) { return <Terminal {...props} />; }

const ONBOARDING_LEVELS = [
    { id: 'beginner', title: 'Beginner', icon: Feather },
    { id: 'intermediate', title: 'Intermediate', icon: Rocket },
    { id: 'advanced', title: 'Advanced', icon: Zap },
];

const ONBOARDING_GOALS = [
    { id: 'career', title: 'Career change' },
    { id: 'skill', title: 'Skill upgrade' },
    { id: 'personal', title: 'Personal interest' },
    { id: 'freelancing', title: 'Freelancing' },
];

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

    // Steps: 1: Selection (Directory), 2: Level, 3: Goals, 4: Diagnostic, 5: Analysis, 6: Generating
    const totalSteps = 6;
    const progress = (step / totalSteps) * 100;

    const handleSelection = (id) => {
        setData({ ...data, field: id });
        setStep(2);
    };

    const toggleGoal = (goalId) => {
        setData(prev => {
            const current = prev.goals || [];
            if (current.includes(goalId)) {
                return { ...prev, goals: current.filter(g => g !== goalId) };
            } else {
                return { ...prev, goals: [...current, goalId] };
            }
        });
    };

    const fetchAssessment = async () => {
        setQuizLoading(true);
        setQuizError(null);
        try {
            // Find title from either list
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
        } finally {
            setQuizLoading(false);
        }
    };

    const calculateQuizResults = () => {
        if (quizQuestions.length === 0) return null;
        let correctCount = 0;

        quizQuestions.forEach((q, i) => {
            const userAnswer = q.options[quizAnswers[i]];
            if (userAnswer === q.correctAnswer) correctCount++;
        });

        const score = correctCount;
        const total = quizQuestions.length;
        const percentage = (score / total) * 100;

        let feedback = "";
        let recommendation = "";

        if (percentage >= 80) {
            feedback = "Outstanding! You have a strong grasp of the core concepts.";
            recommendation = "We're adjusting your plan to skip the basics and focus on advanced, high-impact topics.";
        } else if (percentage >= 50) {
            feedback = "Good work! You have a solid foundation to build upon.";
            recommendation = "We'll briefly review key concepts before diving into intermediate challenges.";
        } else {
            feedback = "Great start! Learning is about the journey.";
            recommendation = "We've added a strong foundational module to ensure you master the basics completely.";
        }

        return { score, total, percentage, feedback, recommendation };
    };

    const handleQuizSubmit = () => {
        const results = calculateQuizResults();
        setQuizResultSummary(results);
        setStep(5); // Show Analysis
    };

    const handleFinalGenerate = async () => {
        setStep(6); // Show Generating
        await generatePath(quizResultSummary);
    };

    const generatePath = async (results) => {
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
                quizResults: results
            };

            const res = await api.post('/courses/generate-path', payload);
            console.log('Path Generated:', res.data);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to generate learning path. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 3) {
            fetchAssessment();
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    // -- RENDERERS --

    const renderDirectory = () => (
        <div className="w-full max-w-5xl mx-auto animate-fade-in">
            {/* Role Based Section */}
            <div className="mb-12">
                <h3 className="text-xl font-bold text-gray-400 mb-6 border-l-4 border-purple-500 pl-4">Role based Roadmaps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ROLE_BASED_ROADMAPS.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => handleSelection(role.id)}
                            className="group relative overflow-hidden bg-[#151515] border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-all text-left hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className={`absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity`}>
                                <role.icon size={100} />
                            </div>
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`p-3 rounded-lg ${role.color} text-white`}>
                                    <role.icon size={24} />
                                </div>
                                <span className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{role.title}</span>
                            </div>
                            <p className="text-sm text-gray-400">{role.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Skill Based Section */}
            <div>
                <h3 className="text-xl font-bold text-gray-400 mb-6 border-l-4 border-blue-500 pl-4">Skill based Roadmaps</h3>
                <div className="flex flex-wrap gap-4">
                    {SKILL_BASED_ROADMAPS.map((skill) => (
                        <button
                            key={skill.id}
                            onClick={() => handleSelection(skill.id)}
                            className="bg-[#151515] border border-gray-800 rounded-lg px-6 py-3 font-semibold text-gray-300 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 transition-all flex items-center gap-2"
                        >
                            <skill.icon size={18} />
                            {skill.title}
                        </button>
                    ))}
                    <button className="bg-[#151515] border border-gray-800 rounded-lg px-6 py-3 font-semibold text-gray-500 hover:text-gray-300 transition-all">
                        + View More
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLevelSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ONBOARDING_LEVELS.map((level) => (
                <button
                    key={level.id}
                    onClick={() => setData({ ...data, level: level.id })}
                    className={`p-8 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300 hover:-translate-y-2 ${data.level === level.id
                            ? 'border-purple-500 bg-purple-500/10 text-purple-500 shadow-xl'
                            : 'border-gray-800 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                        }`}
                >
                    <level.icon size={40} />
                    <span className="text-xl font-bold">{level.title}</span>
                </button>
            ))}
        </div>
    );

    const renderGoalSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {ONBOARDING_GOALS.map((goal) => (
                <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-6 rounded-xl border-2 text-left font-bold transition-all ${data.goals.includes(goal.id)
                            ? 'border-green-500 bg-green-500/10 text-green-500 shadow-lg'
                            : 'border-gray-800 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                        }`}
                >
                    {goal.title}
                </button>
            ))}
        </div>
    );

    const renderQuiz = () => {
        if (quizLoading) return (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                <Loader className="w-12 h-12 text-blue-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Analyzing your profile...</h3>
                <p className="text-gray-400">Generating a custom diagnostic assessment based on your choices.</p>
            </div>
        );

        if (quizError) return (
            <div className="text-center py-10">
                <div className="text-red-500 mb-4 text-lg">{quizError}</div>
                <button onClick={fetchAssessment} className="px-6 py-2 bg-gray-800 rounded-full hover:bg-gray-700 flex items-center mx-auto gap-2">
                    <RefreshCw size={16} /> Retry
                </button>
            </div>
        );

        return (
            <div className="space-y-8 animate-fade-in-up">
                <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-blue-300 mb-1 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Diagnostic Check
                        </h3>
                        <p className="text-sm text-gray-400">
                            Answer these quickly so we can skip what you already know.
                        </p>
                    </div>
                </div>

                {quizQuestions.map((q, index) => (
                    <div key={index} className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
                        <p className="text-lg font-medium text-white mb-4">
                            <span className="text-gray-500 mr-2">{index + 1}.</span>
                            {q.question}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {q.options.map((option, optIdx) => (
                                <button
                                    key={optIdx}
                                    onClick={() => setQuizAnswers({ ...quizAnswers, [index]: optIdx })}
                                    className={`p-4 rounded-lg text-left transition-all ${quizAnswers[index] === optIdx
                                            ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderAnalysis = () => (
        <div className="flex flex-col items-center justify-center py-10 animate-fade-in-up">
            <div className="w-full max-w-2xl bg-[#151515] border border-gray-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>

                <div className="mb-6 inline-flex p-4 rounded-full bg-blue-500/10 border border-blue-500/30">
                    <Trophy className="w-12 h-12 text-blue-400" />
                </div>

                <h2 className="text-3xl font-black text-white mb-2">Analysis Complete</h2>
                <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-6">
                    {quizResultSummary.score}/{quizResultSummary.total}
                </div>

                <div className="bg-gray-800/50 rounded-xl p-6 mb-8 text-left border border-gray-700">
                    <div className="mb-4">
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <Zap className="w-4 h-4 mr-2" /> Feedback
                        </h4>
                        <p className="text-white text-lg">{quizResultSummary.feedback}</p>
                    </div>
                    <div>
                        <h4 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
                            <Target className="w-4 h-4 mr-2" /> Action Plan
                        </h4>
                        <p className="text-green-400 italic">
                            "{quizResultSummary.recommendation}"
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleFinalGenerate}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-white text-lg hover:scale-[1.02] shadow-lg shadow-blue-900/20 transition-all"
                >
                    Generate Custom Roadmap
                </button>
            </div>
        </div>
    );

    const renderGenerating = () => (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-pulse">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                <Layers className="w-20 h-20 text-blue-500 relative z-10 animate-bounce" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Building Your Unique Roadmap</h2>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
                We're crafting a custom curriculum based on your performance.
            </p>
        </div>
    );

    // Dynamic titles
    const getStepTitle = () => {
        switch (step) {
            case 1: return "Developer Roadmaps";
            case 2: return "Select your Level";
            case 3: return "Set your Goals";
            case 4: return "Quick Check";
            case 5: return "Assessment Results";
            default: return "Generating...";
        }
    };

    const getStepDescription = () => {
        switch (step) {
            case 1: return "Select a role or skill to start your personalized journey";
            case 2: return "How much experience do you have in this area?";
            default: return "";
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-4 font-sans selection:bg-purple-500/30">

            {/* Progress Bar (Visible only after step 1 for cleaner 'home' look, or keep it consistent) */}
            {step > 1 && (
                <div className="w-full max-w-3xl mb-12">
                    <div className="flex justify-between text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">
                        <span className={step >= 1 ? "text-blue-500" : ""}>Path</span>
                        <span className={step >= 2 ? "text-purple-500" : ""}>Level</span>
                        <span className={step >= 3 ? "text-yellow-500" : ""}>Goals</span>
                        <span className={step >= 4 ? "text-green-500" : ""}>Check</span>
                        <span className={step >= 5 ? "text-white" : ""}>Result</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="w-full max-w-6xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        {getStepTitle()}
                    </h1>
                    {getStepDescription() && <p className="text-gray-400 text-lg">{getStepDescription()}</p>}
                </div>

                <div className="min-h-[400px]">
                    {step === 1 && renderDirectory()}
                    {step === 2 && renderLevelSelection()}
                    {step === 3 && renderGoalSelection()}
                    {step === 4 && renderQuiz()}
                    {step === 5 && renderAnalysis()}
                    {step === 6 && renderGenerating()}
                </div>

                {/* Navigation (Hidden on Step 1 to enforce selection) */}
                <div className="flex justify-between mt-12 max-w-2xl mx-auto">
                    {step > 1 && step < 4 && (
                        <button
                            onClick={prevStep}
                            className="px-6 py-3 rounded-xl font-bold flex items-center text-gray-400 hover:text-white hover:bg-white/5 transition"
                        >
                            <ChevronLeft className="mr-2" /> Back
                        </button>
                    )}

                    <div className="flex-1"></div>

                    {step > 1 && step < 4 && (
                        <button
                            onClick={nextStep}
                            disabled={
                                (step === 2 && !data.level) ||
                                (step === 3 && data.goals.length === 0)
                            }
                            className="px-8 py-3 bg-white text-black rounded-xl font-bold flex items-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all"
                        >
                            Next <ChevronRight className="ml-2" />
                        </button>
                    )}

                    {step === 4 && (
                        <button
                            onClick={handleQuizSubmit}
                            disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold flex items-center shadow-lg hover:shadow-purple-500/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Show Results <Trophy className="ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;

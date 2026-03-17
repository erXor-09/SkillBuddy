import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Flame, Trophy, Star, CheckCircle, XCircle, ChevronRight,
    Clock, Zap, BarChart2, ArrowRight, RotateCcw, Lightbulb,
    ExternalLink, BookOpen, Youtube, Link2
} from 'lucide-react';
import api from '../api/axios';
import { useTheme } from '../context/ThemeContext';

// ─── Constants ───────────────────────────────────────────────────────────────
const QUESTION_TIME = 30; // seconds per question

// ─── Helpers ─────────────────────────────────────────────────────────────────
const optionLabel = (idx) => String.fromCharCode(65 + idx); // A, B, C, D

// ─── Sub-components ──────────────────────────────────────────────────────────

const ProgressBar = ({ current, total, darkMode }) => (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: darkMode ? '#2D3249' : '#E5E7EB' }}>
        <motion.div
            className="h-full rounded-full bg-theme"
            initial={false}
            animate={{ width: `${(current / total) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        />
    </div>
);

const Timer = ({ seconds, darkMode }) => {
    const pct = (seconds / QUESTION_TIME) * 100;
    const color = seconds <= 10 ? '#EF4444' : seconds <= 20 ? '#F59E0B' : '#10B981';
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke={darkMode ? '#2D3249' : '#E5E7EB'} strokeWidth="4" />
                <motion.circle
                    cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    animate={{ strokeDashoffset: `${2 * Math.PI * 20 * (1 - pct / 100)}` }}
                    transition={{ duration: 0.3 }}
                />
            </svg>
            <span className="text-sm font-black" style={{ color }}>{seconds}</span>
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const DailyQuiz = () => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const [phase, setPhase] = useState('loading'); // loading | quiz | results | done
    const [quizData, setQuizData] = useState(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [selected, setSelected] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [results, setResults] = useState(null);
    const [resources, setResources] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const timerRef = useRef(null);

    // ── Fetch Quiz ────────────────────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/daily-quiz/today');
                setQuizData(res.data);
                if (res.data.completed) {
                    setPhase('done');
                    // Reconstruct results from saved data
                    setResults({
                        score: res.data.score,
                        totalQuestions: res.data.totalQuestions,
                        pointsEarned: res.data.pointsEarned,
                        streak: null,
                        results: res.data.results,
                        questions: res.data.questions,
                    });
                } else {
                    setPhase('quiz');
                }
            } catch (e) {
                setError('Failed to load today\'s quiz. Please try again.');
                setPhase('quiz');
            }
        })();
    }, []);

    // ── Timer ─────────────────────────────────────────────────────────────────
    const handleTimeout = useCallback(() => {
        // Auto-advance with no answer on timeout
        handleAnswer(null);
    }, [currentIdx, answers]); // eslint-disable-line

    useEffect(() => {
        if (phase !== 'quiz' || selected !== null) return;
        setTimeLeft(QUESTION_TIME);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [phase, currentIdx]); // eslint-disable-line

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleAnswer = (option) => {
        clearInterval(timerRef.current);
        setSelected(option ?? '__timeout__');
        setAnswers(prev => {
            const next = [...prev];
            next[currentIdx] = option || '';
            return next;
        });
    };

    const handleNext = async () => {
        const isLast = currentIdx === (quizData?.questions?.length ?? 1) - 1;
        if (isLast) {
            await submitQuiz();
        } else {
            setCurrentIdx(i => i + 1);
            setSelected(null);
            setShowHint(false);
        }
    };

    const submitQuiz = async () => {
        setSubmitting(true);
        try {
            const res = await api.post('/daily-quiz/submit', {
                quizId: quizData.quizId,
                answers,
            });
            setResults(res.data);
            setResources(res.data.resources || []);
            setPhase('results');
        } catch (e) {
            setError('Failed to submit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Styles ────────────────────────────────────────────────────────────────
    const bg = darkMode ? '#0F1117' : '#F9FAFB';
    const surface = darkMode ? '#1A1D27' : '#FFFFFF';
    const border = darkMode ? '#2D3249' : '#E5E7EB';
    const textPrimary = darkMode ? '#F1F5F9' : '#111827';
    const textSecondary = darkMode ? '#94A3B8' : '#6B7280';

    // ── Render: Loading ───────────────────────────────────────────────────────
    if (phase === 'loading') {
        return (
            <div className="flex flex-col h-full items-center justify-center" style={{ background: bg }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="w-12 h-12 rounded-full border-4 border-theme border-t-transparent mb-4" />
                <p className="font-bold" style={{ color: textSecondary }}>Generating your daily quiz…</p>
            </div>
        );
    }

    // ── Render: Error ─────────────────────────────────────────────────────────
    if (error && phase !== 'results') {
        return (
            <div className="flex flex-col h-full items-center justify-center p-8" style={{ background: bg }}>
                <XCircle className="w-16 h-16 text-red-400 mb-4" />
                <p className="text-lg font-black mb-6" style={{ color: textPrimary }}>{error}</p>
                <button onClick={() => window.location.reload()}
                    className="bg-theme text-white px-6 py-3 font-black flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    // ── Render: Results (and Already Done) ───────────────────────────────────
    if (phase === 'results' || phase === 'done') {
        const r = results;
        const pct = r ? Math.round((r.score / r.totalQuestions) * 100) : 0;
        const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '🎯' : pct >= 40 ? '💪' : '📚';
        const msg = pct >= 80 ? 'Outstanding!' : pct >= 60 ? 'Great work!' : pct >= 40 ? 'Keep going!' : 'Keep practising!';

        return (
            <div className="flex flex-col h-full overflow-y-auto" style={{ background: bg }}>
                {/* Header */}
                <div className="px-8 pt-8 pb-4 shrink-0" style={{ background: surface, borderBottom: `1px solid ${border}` }}>
                    <div className="max-w-2xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-theme-light flex items-center justify-center">
                                <BarChart2 className="w-5 h-5 text-theme" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black" style={{ color: textPrimary }}>Quiz Results</h1>
                                <p className="text-xs" style={{ color: textSecondary }}>{phase === 'done' ? 'Already completed today' : 'Today\'s quiz'}</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/leaderboard')}
                            className="text-sm font-black text-theme flex items-center gap-1 hover:underline">
                            View Leaderboard <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6 md:p-10">
                    <div className="max-w-2xl mx-auto space-y-6">

                        {/* Score Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-theme rounded-none p-8 text-white relative overflow-hidden shadow-xl">
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">{msg}</p>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-6xl font-black">{r?.score}</span>
                                        <span className="text-2xl font-bold text-white/60">/ {r?.totalQuestions}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-bold">
                                            <Star className="w-4 h-4 text-amber-300" /> +{r?.pointsEarned} pts
                                        </span>
                                        {r?.streak != null && (
                                            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-bold">
                                                <Flame className="w-4 h-4 text-orange-300" /> {r.streak}d streak
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-7xl">{emoji}</div>
                            </div>
                            {/* Score bar */}
                            <div className="relative z-10 mt-6">
                                <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                                    <motion.div className="h-full bg-white rounded-full"
                                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} />
                                </div>
                                <p className="text-xs text-white/60 mt-1.5 text-right">{pct}% accuracy</p>
                            </div>
                        </motion.div>

                        {/* Question Breakdown */}
                        {r?.questions && (
                            <div className="space-y-3">
                                <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: textSecondary }}>
                                    Question Breakdown
                                </h2>
                                {r.questions.map((q, i) => {
                                    const res_i = r.results?.[i];
                                    const isCorrect = res_i?.isCorrect;
                                    return (
                                        <motion.div key={i}
                                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06 }}
                                            className="rounded-none border p-5 shadow-sm"
                                            style={{ background: surface, borderColor: isCorrect ? '#10B981' : '#EF4444', borderLeftWidth: 4 }}>
                                            <div className="flex items-start gap-3">
                                                <div className="shrink-0 mt-0.5">
                                                    {isCorrect
                                                        ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        : <XCircle className="w-5 h-5 text-red-500" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm mb-2" style={{ color: textPrimary }}>
                                                        Q{i + 1}. {q.question}
                                                    </p>
                                                    {!isCorrect && res_i?.userAnswer && (
                                                        <p className="text-xs mb-1" style={{ color: '#EF4444' }}>
                                                            Your answer: <span className="font-bold">{res_i.userAnswer || 'No answer'}</span>
                                                        </p>
                                                    )}
                                                    <p className="text-xs mb-2" style={{ color: '#10B981' }}>
                                                        ✓ {q.correctAnswer}
                                                    </p>
                                                    {q.explanation && (
                                                        <p className="text-xs p-3 rounded-none" style={{ background: darkMode ? '#0F1117' : '#F9FAFB', color: textSecondary }}>
                                                            {q.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Recommended Resources */}
                        {resources.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="space-y-3">
                                <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: textSecondary }}>
                                    📚 Recommended Resources
                                </h2>
                                <div className="space-y-3">
                                    {resources.map((res, i) => {
                                        const isVideo = res.type === 'youtube' || res.type === 'video';
                                        return (
                                            <motion.a key={i}
                                                href={res.url} target="_blank" rel="noopener noreferrer"
                                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.05 * i }}
                                                className="flex items-start gap-4 p-4 rounded-none border transition-all hover:shadow-md group"
                                                style={{ background: surface, borderColor: border }}
                                                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-theme)'}
                                                onMouseLeave={e => e.currentTarget.style.borderColor = border}
                                            >
                                                {/* Icon */}
                                                <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                    isVideo ? 'bg-red-100' : 'bg-blue-100'
                                                }`}>
                                                    {isVideo
                                                        ? <Youtube className="w-5 h-5 text-red-500" />
                                                        : <BookOpen className="w-5 h-5 text-blue-500" />}
                                                </div>
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate group-hover:text-theme transition-colors" style={{ color: textPrimary }}>
                                                        {res.title}
                                                    </p>
                                                    {res.description && (
                                                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: textSecondary }}>
                                                            {res.description}
                                                        </p>
                                                    )}
                                                    <span className="text-xs font-bold mt-1 inline-block" style={{ color: textSecondary }}>
                                                        ⏱ {res.duration || '—'}
                                                    </span>
                                                </div>
                                                <ExternalLink className="w-4 h-4 shrink-0 mt-1 text-theme opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.a>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pb-8">
                            <button onClick={() => navigate('/student/overview')}
                                className="flex-1 py-3 font-black text-sm border-2 border-theme text-theme hover:bg-theme-light transition-colors">
                                Back to Dashboard
                            </button>
                            <button onClick={() => navigate('/leaderboard')}
                                className="flex-1 py-3 font-black text-sm bg-theme text-white hover:bg-theme-hover transition-colors flex items-center justify-center gap-2">
                                <Trophy className="w-4 h-4" /> Leaderboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: Quiz ─────────────────────────────────────────────────────────
    const questions = quizData?.questions || [];
    const q = questions[currentIdx];
    if (!q) return null;

    const totalQ = questions.length;
    const isAnswered = selected !== null;

    return (
        <div className="flex flex-col h-full overflow-hidden" style={{ background: bg }}>
            {/* Sticky Header */}
            <div className="px-6 py-4 shrink-0 flex items-center justify-between"
                style={{ background: surface, borderBottom: `1px solid ${border}` }}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-theme-light flex items-center justify-center rounded-full">
                        <Zap className="w-4 h-4 text-theme" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: textSecondary }}>Daily Quiz</p>
                        <p className="text-sm font-black" style={{ color: textPrimary }}>{quizData?.field}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black" style={{ color: textSecondary }}>
                        {currentIdx + 1} / {totalQ}
                    </span>
                    {!isAnswered && <Timer seconds={timeLeft} darkMode={darkMode} />}
                </div>
            </div>

            {/* Progress */}
            <div className="px-6 pt-2 pb-0 shrink-0" style={{ background: surface }}>
                <ProgressBar current={currentIdx} total={totalQ} darkMode={darkMode} />
            </div>

            {/* Question Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div key={currentIdx}
                            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}>

                            {/* Question */}
                            <div className="mb-8">
                                <span className="text-xs font-black uppercase tracking-widest text-theme mb-3 block">
                                    Question {currentIdx + 1}
                                </span>
                                <h2 className="text-xl md:text-2xl font-black leading-snug" style={{ color: textPrimary }}>
                                    {q.question}
                                </h2>
                                {q.hint && !isAnswered && (
                                    <button onClick={() => setShowHint(h => !h)}
                                        className="mt-3 flex items-center gap-1.5 text-xs font-bold"
                                        style={{ color: textSecondary }}>
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                        {showHint ? 'Hide hint' : 'Show hint'}
                                    </button>
                                )}
                                <AnimatePresence>
                                    {showHint && q.hint && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-3 px-4 py-3 rounded-none text-sm font-medium"
                                            style={{ background: darkMode ? '#2D3249' : '#FEF3C7', color: darkMode ? '#FCD34D' : '#92400E' }}>
                                            💡 {q.hint}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 mb-8">
                                {q.options.map((opt, oi) => {
                                    const label = optionLabel(oi);
                                    const isSelected = selected === opt || selected === '__timeout__' && false;
                                    const isChosen = selected === opt;

                                    return (
                                        <motion.button key={oi}
                                            whileHover={!isAnswered ? { x: 4 } : {}}
                                            whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                            onClick={() => !isAnswered && handleAnswer(opt)}
                                            className="w-full text-left flex items-center gap-4 p-4 border-2 transition-all duration-200 font-semibold text-sm"
                                            style={{
                                                background: isChosen ? (darkMode ? '#1E293B' : '#EEF2FF') : surface,
                                                borderColor: isChosen ? 'var(--color-theme, #6366F1)' : border,
                                                color: isChosen ? 'var(--color-theme, #6366F1)' : textPrimary,
                                                cursor: isAnswered ? 'default' : 'pointer',
                                                opacity: isAnswered && !isChosen ? 0.6 : 1,
                                            }}>
                                            <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-xs font-black"
                                                style={{
                                                    background: isChosen ? 'var(--color-theme, #6366F1)' : (darkMode ? '#2D3249' : '#F3F4F6'),
                                                    color: isChosen ? '#fff' : textSecondary
                                                }}>
                                                {label}
                                            </span>
                                            {opt}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Next Button */}
                            <AnimatePresence>
                                {isAnswered && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                            onClick={handleNext}
                                            disabled={submitting}
                                            className="w-full bg-theme hover:bg-theme-hover text-white py-4 font-black text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                                            {submitting ? (
                                                <>
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                                    Submitting…
                                                </>
                                            ) : currentIdx < totalQ - 1 ? (
                                                <>Next Question <ChevronRight className="w-4 h-4" /></>
                                            ) : (
                                                <>View Results <Trophy className="w-4 h-4" /></>
                                            )}
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Timeout notice */}
                            {selected === '__timeout__' && (
                                <p className="text-center text-sm font-bold text-red-400 mt-3">
                                    ⏱ Time's up! Moving on…
                                </p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DailyQuiz;

const DailyQuiz = require('../models/DailyQuiz');
const StudentProfile = require('../models/StudentProfile');
const { generateAssessmentQuestions, generateQuizResources } = require('../services/ai-service');

// Get today's date key in YYYY-MM-DD (UTC)
function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

// ======================================================
// GET /api/daily-quiz/today
// Returns today's quiz for the current student.
// If none exists, generates one using their interest field.
// Never returns correctAnswer to the client.
// ======================================================
exports.getTodaysQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = getTodayKey();

        // Check if already exists
        let quiz = await DailyQuiz.findOne({ userId, date: today });

        if (!quiz) {
            // Fetch student profile for field / level
            const profile = await StudentProfile.findOne({ userId });
            const field = profile?.onboarding?.field || 'Web Development';
            const level = profile?.onboarding?.level || 'Beginner';

            console.log(`🎯 Generating daily quiz for ${field} (${level})`);

            // Generate 5 questions with the existing AI service
            const rawQuestions = await generateAssessmentQuestions(field, level, 5);

            quiz = await DailyQuiz.create({
                userId,
                date: today,
                field,
                level,
                questions: rawQuestions,
                totalQuestions: rawQuestions.length,
            });
        }

        // Strip correct answers before sending to client
        const clientQuestions = quiz.questions.map((q, i) => ({
            index: i,
            question: q.question,
            options: q.options,
            hint: q.hint || '',
        }));

        res.json({
            quizId: quiz._id,
            date: quiz.date,
            field: quiz.field,
            level: quiz.level,
            completed: quiz.completed,
            score: quiz.completed ? quiz.score : undefined,
            totalQuestions: quiz.totalQuestions,
            pointsEarned: quiz.completed ? quiz.pointsEarned : undefined,
            results: quiz.completed ? quiz.results : undefined,
            // Include full questions with answers only when already completed
            questions: quiz.completed
                ? quiz.questions.map((q, i) => ({
                    index: i,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    hint: q.hint,
                }))
                : clientQuestions,
        });
    } catch (error) {
        console.error('Get Daily Quiz Error:', error);
        res.status(500).json({ error: 'Failed to fetch daily quiz' });
    }
};

// ======================================================
// POST /api/daily-quiz/submit
// Body: { quizId, answers: ["Option A", "Option B", ...] }
// Scores server-side, updates streak & points.
// ======================================================
exports.submitQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quizId, answers } = req.body;

        const quiz = await DailyQuiz.findById(quizId);
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        if (quiz.userId.toString() !== userId) return res.status(403).json({ error: 'Forbidden' });
        if (quiz.completed) return res.status(400).json({ error: 'Quiz already submitted' });

        // Score answers
        let score = 0;
        const results = quiz.questions.map((q, i) => {
            const userAnswer = answers[i] || '';
            const isCorrect = userAnswer.trim() === q.correctAnswer?.trim();
            if (isCorrect) score++;
            return { questionIndex: i, userAnswer, isCorrect };
        });

        const pointsEarned = score * 50; // 50 pts per correct answer

        // Save result to quiz
        quiz.completed = true;
        quiz.score = score;
        quiz.pointsEarned = pointsEarned;
        quiz.submittedAt = new Date();
        quiz.results = results;
        await quiz.save();

        // Update StudentProfile: streak + points
        const profile = await StudentProfile.findOne({ userId });
        if (profile) {
            const today = getTodayKey();
            const lastActive = profile.lastActiveDate
                ? profile.lastActiveDate.toISOString().slice(0, 10)
                : null;

            // Increment streak if last active was yesterday or today is the first activity
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayKey = yesterday.toISOString().slice(0, 10);

            if (lastActive === yesterdayKey) {
                profile.streak = (profile.streak || 0) + 1;
            } else if (lastActive !== today) {
                // Reset streak if they missed a day
                profile.streak = 1;
            }
            // If lastActive === today, don't change streak (already counted today)

            profile.points = (profile.points || 0) + pointsEarned;
            profile.stats = profile.stats || {};
            profile.stats.quizzesTaken = (profile.stats.quizzesTaken || 0) + 1;
            profile.lastActiveDate = new Date();
            await profile.save();
        }

        // Generate recommended resources for the quiz topic
        let resources = [];
        try {
            const topicKeywords = quiz.questions.slice(0, 3).map(q => q.topic || q.question.split(' ').slice(0,3).join(' '));
            resources = await generateQuizResources(quiz.field, quiz.level, topicKeywords);
        } catch (e) {
            console.warn('Resource gen skipped:', e.message);
        }

        // Return full results with correct answers + resources
        res.json({
            score,
            totalQuestions: quiz.totalQuestions,
            pointsEarned,
            streak: profile?.streak || 0,
            results,
            resources,
            questions: quiz.questions.map((q, i) => ({
                index: i,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
            })),
        });
    } catch (error) {
        console.error('Submit Daily Quiz Error:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

const mongoose = require('mongoose');

const dailyQuizSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Date key: YYYY-MM-DD so one quiz per student per day
    date: { type: String, required: true },

    // Topic this quiz covers (from student's onboarding field)
    field: { type: String, default: 'General Knowledge' },
    level: { type: String, default: 'Beginner' },

    // AI generated questions stored server-side for scoring
    questions: [{
        question: String,
        options: [String],
        correctAnswer: String,
        explanation: String,
        hint: String,
        topic: String
    }],

    // Submission state
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    submittedAt: { type: Date },

    // Per-question results saved after submission
    results: [{
        questionIndex: Number,
        userAnswer: String,
        isCorrect: Boolean
    }]
}, { timestamps: true });

// Compound unique index: one quiz per user per day
dailyQuizSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyQuiz', dailyQuizSchema);

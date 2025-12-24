const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },

    title: String, // Teacher title (optional)

    bio: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        default: ""
    },

    avatar: {
        type: String,
        default: ""
    },
    avatarData: {
        type: Buffer
    },
    avatarContentType: {
        type: String
    },

    interests: [{ type: String }],
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],

    // Verification
    isEmailVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
    otpAttempts: { type: Number, default: 0 },

}, { timestamps: true }); // ✅ auto handles createdAt & updatedAt

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

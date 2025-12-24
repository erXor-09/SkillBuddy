const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If manually created by teacher
    field: String,
    level: String,
    thumbnail: String,
    tags: [String],

    // For AI generated courses, this structured curriculum is key
    modules: [{
        id: String,
        title: String,
        description: String,
        order: Number,
        topics: [{
            id: String,
            title: String,
            description: String,
            resources: [{
                type: { type: String, enum: ['video', 'article', 'book', 'documentation'] },
                title: String,
                url: String,
                duration: String, // e.g. "10 mins"
                completed: { type: Boolean, default: false }
            }]
        }]
    }],

    isPublished: { type: Boolean, default: false },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);

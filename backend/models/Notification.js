const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'alert'],
        default: 'info'
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String, // Optional URL to navigate to when clicked
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

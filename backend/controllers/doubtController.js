const Doubt = require('../models/Doubt');
const aiService = require('../services/ai-service');

exports.createDoubt = async (req, res) => {
    try {
        const { title, description, tags, moduleId, topicId } = req.body;

        const doubt = new Doubt({
            studentId: req.user.id,
            title,
            description,
            tags,
            moduleId,
            topicId,
            status: 'open'
        });

        await doubt.save();

        // AI Auto-Response
        try {
            console.log("Generating AI response for doubt...");
            const aiResponse = await aiService.callOpenRouter(`
            User asked: "${title}"
            Details: "${description}"
            Provide a helpful, technical answer as an instructor.
            Keep it concise.
        `);

            doubt.answers.push({
                responderName: 'AI Assistant',
                content: aiResponse,
                isAccepted: false,
                createdAt: new Date()
            });

            doubt.status = 'answered';
            await doubt.save();

        } catch (aiError) {
            console.error("AI Auto-response failed", aiError);
        }

        res.status(201).json({ doubt });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error creating doubt' });
    }
};

exports.getDoubts = async (req, res) => {
    try {
        // Filter by user or all? For now, let's get all public doubts or user's doubts
        // User might want to see their own doubts
        const doubts = await Doubt.find({ studentId: req.user.id }).sort({ createdAt: -1 });
        res.json({ doubts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllDoubts = async (req, res) => {
    // For community or teacher view
    try {
        const doubts = await Doubt.find().populate('studentId', 'name').sort({ createdAt: -1 });
        res.json({ doubts });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

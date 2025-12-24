const Course = require('../models/Course');
const StudentProfile = require('../models/StudentProfile');
const aiService = require('../services/ai-service');

// Generate a personalized learning path
exports.generatePath = async (req, res) => {
    try {
        const { field, level, goals, quizResults } = req.body;
        const userId = req.user.id;

        console.log(`Generating path for user ${userId} in ${field} (${level}) with quiz score: ${quizResults?.score}`);

        let pathData;
        try {
            pathData = await aiService.generateLearningPath(field, level, goals, quizResults);
        } catch (e) {
            console.error("AI Generation failed, using fallback", e);
            return res.status(500).json({ error: "Failed to generate learning path via AI" });
        }

        const profile = await StudentProfile.findOne({ userId });
        if (profile) {
            profile.onboarding = { field, level, goals, completed: true };

            // Map AI modules to Schema
            profile.currentPath = {
                generatedAt: new Date(),
                modules: pathData.modules.map(m => ({
                    id: new Date().getTime().toString() + Math.random(), // Simple ID gen
                    title: m.title,
                    description: m.description,
                    duration: m.duration,
                    status: 'locked',
                    topics: m.topics ? m.topics.map(t => ({
                        id: Math.random().toString(36).substr(2, 9),
                        title: t.title,
                        description: t.description,
                        status: 'pending',
                        resources: [] // To be populated later
                    })) : []
                }))
            };

            // Unlock first module
            if (profile.currentPath.modules.length > 0) {
                profile.currentPath.modules[0].status = 'unlocked';
            }

            await profile.save();
        }

        res.json({ message: 'Learning path generated', path: profile.currentPath });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error generating path' });
    }
};

exports.getOnboardingAssessment = async (req, res) => {
    try {
        const { field, level } = req.body;
        console.log(`Generating diagnostic quiz for ${field} (${level})`);

        let questions = [];
        try {
            questions = await aiService.generateAssessmentQuestions(field || 'General', level || 'Beginner', 5);
        } catch (aiError) {
            console.error("AI Service Error in Controller:", aiError);
            // Fallback if AI service throws uncaught error
        }

        // Double check we have questions, if not, use hardcoded fallback
        if (!questions || questions.length === 0) {
            console.log("Using hardcoded fallback questions");
            questions = Array.from({ length: 5 }, (_, i) => ({
                question: `Diagnostic Question ${i + 1} about ${field || 'General Knowledge'}`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: 'Option A',
                explanation: 'This is a fallback question because AI generation failed.',
                hint: 'Choose the first option.',
                bloomLevel: 'remember',
                topic: field || 'Basics'
            }));
        }

        res.json({ questions });
    } catch (error) {
        console.error("Critical Error in getOnboardingAssessment:", error);
        res.status(500).json({ error: 'Failed to generate assessment' });
    }
};

exports.getStudentDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        const profile = await StudentProfile.findOne({ userId });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        res.json({ profile });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get details for a specific module/topic, generating resources if needed
exports.getTopicDetails = async (req, res) => {
    try {
        const { moduleId, topicId } = req.params;
        const userId = req.user.id;

        const profile = await StudentProfile.findOne({ userId });
        if (!profile) return res.status(404).json({ error: 'Profile not found' });

        const moduleDoc = profile.currentPath.modules.find(m => m.id === moduleId || m._id.toString() === moduleId);
        if (!moduleDoc) return res.status(404).json({ error: 'Module not found' });

        const topicDoc = moduleDoc.topics.find(t => t.id === topicId || t._id.toString() === topicId);
        if (!topicDoc) return res.status(404).json({ error: 'Topic not found' });

        // If resources are empty, generate them!
        if (!topicDoc.resources || topicDoc.resources.length === 0) {
            console.log(`Generating resources for topic: ${topicDoc.title}`);
            const resourcesData = await aiService.generateResourceRecommendations(
                profile.onboarding.field,
                profile.onboarding.level,
                [topicDoc.title]
            );

            topicDoc.resources = resourcesData.recommendations.map(r => ({
                type: r.type.toLowerCase(),
                title: r.title,
                url: r.url,
                duration: '10 min',
                completed: false
            }));

            // Save the detailed content/notes
            topicDoc.content = resourcesData.content;

            await profile.save();
        }

        res.json({ topic: topicDoc });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching topic details' });
    }
};

exports.updateResourceProgress = async (req, res) => {
    try {
        const { moduleId, topicId, resourceId, progress } = req.body; // progress 0-100
        const userId = req.user.id;

        const profile = await StudentProfile.findOne({ userId });
        const moduleDoc = profile.currentPath.modules.find(m => m.id === moduleId || m._id.toString() === moduleId);
        const topicDoc = moduleDoc.topics.find(t => t.id === topicId || t._id.toString() === topicId);
        const resource = topicDoc.resources.find(r => r._id.toString() === resourceId || r.id === resourceId);

        if (resource) {
            resource.completed = progress === 100;
        }

        const allCompleted = topicDoc.resources.every(r => r.completed);
        if (allCompleted) {
            topicDoc.status = 'completed';
        }

        await profile.save();
        res.json({ success: true, topicStatus: topicDoc.status });

    } catch (error) {
        res.status(500).json({ error: 'Error updating progress' });
    }
};

exports.createCourse = async (req, res) => {
    console.log("createCourse hit!");
    console.log("Body:", req.body);
    console.log("User:", req.user);
    try {
        const { title, description, level, field } = req.body;

        if (!req.user || !req.user.id) {
            console.log("No user ID found in request");
            return res.status(401).json({ error: "User not authenticated properly" });
        }

        const teacherId = req.user.id;

        // Basic validation
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const newCourse = new Course({
            title,
            description,
            level,
            field,
            author: teacherId,
            isPublished: true,
            modules: []
        });

        const savedCourse = await newCourse.save();
        console.log("Course saved:", savedCourse._id);
        res.status(201).json({ message: 'Course created successfully', course: savedCourse });
    } catch (error) {
        console.error("Error creating course FULL ERROR:", error);
        res.status(500).json({ error: 'Server error creating course: ' + error.message });
    }
};

exports.getTeacherCourses = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const courses = await Course.find({ author: teacherId }).sort({ createdAt: -1 });
        res.json({ courses });
    } catch (error) {
        console.error("Error fetching teacher courses:", error);
        res.status(500).json({ error: 'Server error fetching courses' });
    }
};


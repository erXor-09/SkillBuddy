const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');

router.post('/generate-path', auth, courseController.generatePath);
router.post('/onboarding-assessment', auth, courseController.getOnboardingAssessment);
router.get('/dashboard', auth, courseController.getStudentDashboard);
// New Routes
router.get('/module/:moduleId/topic/:topicId', auth, courseController.getTopicDetails);
router.post('/progress', auth, courseController.updateResourceProgress);
router.post('/create', auth, courseController.createCourse);
router.get('/teacher-courses', auth, courseController.getTeacherCourses);


module.exports = router;

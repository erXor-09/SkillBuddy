const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dailyQuizController = require('../controllers/dailyQuizController');

router.get('/today', auth, dailyQuizController.getTodaysQuiz);
router.post('/submit', auth, dailyQuizController.submitQuiz);

module.exports = router;

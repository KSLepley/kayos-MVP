const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const diaryController = require('../controllers/diaryController');

router.post('/diary', authenticate, diaryController.addDiaryEntry);
router.get('/diary', authenticate, diaryController.getDiaryByDate);
router.get('/diary/summary', authenticate, diaryController.getDailySummary);

module.exports = router;
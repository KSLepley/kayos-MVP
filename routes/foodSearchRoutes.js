const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const foodSearchController = require('../controllers/foodSearchController');

// Protected food search route
router.get('/search', authenticate, foodSearchController.searchFood);

module.exports = router;
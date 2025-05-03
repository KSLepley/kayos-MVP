const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

// Protected test route (only works if user is logged in)
router.get('/diary', authenticate, (req, res) => {
  const userId = req.user.id; // we got this from the token
  res.json({ message: `Welcome! This is your diary, user ${userId}` });
});

module.exports = router;
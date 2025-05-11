const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { registerRules, loginRules, validate } = require('../utils/validation');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Register route
router.post('/register', registerRules, validate, register);

// Login route
router.post('/login', loginRules, validate, login);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;
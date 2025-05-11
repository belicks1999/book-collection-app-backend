const express = require('express');
const { updateProfile, updatePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { profileUpdateRules, passwordUpdateRules, validate } = require('../utils/validation');

const router = express.Router();

// Protect all routes
router.use(protect);

// Update profile
router.put('/profile', profileUpdateRules, validate, updateProfile);

// Update password
router.put('/password', passwordUpdateRules, validate, updatePassword);

module.exports = router;
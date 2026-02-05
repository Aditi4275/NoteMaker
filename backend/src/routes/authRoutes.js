/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerRules, loginRules } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

router.post('/register', registerRules, register);
router.post('/login', loginRules, login);
router.get('/me', protect, getMe);

module.exports = router;

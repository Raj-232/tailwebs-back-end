const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;
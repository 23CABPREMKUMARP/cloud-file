const express = require('express');
const { register, login, getStaff } = require('../controllers/authController');
const router = express.Router();

const { authMiddleware, roleMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/staff', authMiddleware, roleMiddleware(['ADMIN', 'STAFF']), getStaff);

module.exports = router;

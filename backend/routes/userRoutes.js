const express = require('express');
const { loginUser, vote, getUserById } = require('../controllers/userController');
const router = express.Router();

// POST: Student login
router.post('/login', loginUser);

// POST: Vote for candidate
router.post('/vote', vote);

// GET: Get user details (used to check voted roles)
router.get('/:id', getUserById);

module.exports = router;
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Fixed admin credentials
const ADMIN_EMAIL = 'admin@college.com';
const ADMIN_PASSWORD = 'admin123';

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ admin: true }, 'your_admin_secret_key');
    return res.json({ token });
  }

  res.status(401).json({ message: 'Invalid admin credentials' });
});

module.exports = router;
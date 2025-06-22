const User = require('../models/User');
const Candidate = require('../models/Candidate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Student Login Handler
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: Email not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, 'your_user_secret_key', { expiresIn: '3h' });
    res.json({ token });

  } catch (err) {
    console.error("Error in loginUser:", err.message);
    res.status(500).json({ message: 'Login error' });
  }
};

// ✅ Voting Handler
exports.vote = async (req, res) => {
  const { userId, candidateId } = req.body;

  try {
    const user = await User.findById(userId);
    const candidate = await Candidate.findById(candidateId);

    if (!user || !candidate) {
      console.warn(`Vote error: User or candidate not found (userId: ${userId}, candidateId: ${candidateId})`);
      return res.status(404).json({ message: 'User or candidate not found' });
    }

    const role = candidate.role.trim();

    // Initialize votedRoles map if not present
    if (!user.votedRoles) user.votedRoles = new Map();

    // Check if user already voted for this role
    if (user.votedRoles.get(role)) {
      return res.status(400).json({ message: `You have already voted for ${role}` });
    }

    // Record vote
    candidate.votes += 1;
    await candidate.save();

    // Update user record
    user.votedRoles.set(role, true);
    await user.save();

    res.json({ message: `Vote recorded for ${candidate.name} as ${role}` });

  } catch (err) {
    console.error("Error in vote:", err.message);
    res.status(500).json({ message: 'Error recording vote' });
  }
};

// ✅ Get user by ID for votedRoles
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('votedRoles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ votedRoles: user.votedRoles || {} });
  } catch (err) {
    console.error("Error in getUserById:", err.message);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};
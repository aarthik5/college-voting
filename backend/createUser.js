const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/collegeVoting')
  .then(async () => {
    const hashedPassword = await bcrypt.hash('test123', 10);
    await User.create({
      email: 'student1@college.com',
      password: hashedPassword,
      votedRoles: {}
    });
    console.log('✅ Test user created');
    process.exit();
  })
  .catch(err => console.error('❌ Error:', err));
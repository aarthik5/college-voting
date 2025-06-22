const express = require('express');
const multer = require('multer');
const {
  addCandidate,
  getAllCandidates,
  deleteCandidate
} = require('../controllers/adminController');

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Routes
router.post('/add-candidate', upload.single('image'), addCandidate);
router.get('/candidates', getAllCandidates);
router.delete('/candidates/:id', deleteCandidate); // ✅ DELETE candidate by ID

module.exports = router;
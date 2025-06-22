const Candidate = require('../models/Candidate');

// ✅ Add a new candidate (with image upload)
exports.addCandidate = async (req, res) => {
  try {
    const { name, role } = req.body;
    const imagePath = req.file.path;

    const candidate = new Candidate({ name, role, image: imagePath });
    await candidate.save();

    res.json({ message: 'Candidate added' });
  } catch (err) {
    console.error('Error adding candidate:', err.message);
    res.status(500).json({ message: 'Error adding candidate' });
  }
};

// ✅ Get all candidates
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err.message);
    res.status(500).json({ message: 'Error fetching candidates' });
  }
};

// ✅ Delete a candidate by ID
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    await Candidate.findByIdAndDelete(id);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (err) {
    console.error('Error deleting candidate:', err.message);
    res.status(500).json({ message: 'Error deleting candidate' });
  }
};
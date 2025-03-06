const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meditation = require('../models/Meditation');

// @route   GET /api/meditations
// @desc    Get all meditations for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const meditations = await Meditation.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(meditations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/meditations/stats
// @desc    Get meditation statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Total meditation time
    const meditations = await Meditation.find({ user: req.user.id });
    const totalTime = meditations.reduce((sum, meditation) => sum + meditation.duration, 0);
    
    // Sessions count
    const sessionsCount = meditations.length;
    
    // Recent activity - last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentActivity = await Meditation.find({
      user: req.user.id,
      createdAt: { $gte: oneWeekAgo }
    }).sort({ createdAt: -1 });
    
    res.json({
      totalTime,
      sessionsCount,
      recentActivity
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/meditations
// @desc    Create a new meditation session
// @access  Private
router.post('/', auth, async (req, res) => {
  const { duration, type, notes } = req.body;
  
  try {
    // Create new meditation
    const newMeditation = new Meditation({
      user: req.user.id,
      duration,
      type: type || 'silent',
      notes: notes || '',
      completed: true
    });
    
    // Save meditation
    const meditation = await newMeditation.save();
    res.json(meditation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/meditations/:id
// @desc    Delete a meditation session
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const meditation = await Meditation.findById(req.params.id);
    
    if (!meditation) {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    
    // Check if meditation belongs to user
    if (meditation.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Remove meditation
    await meditation.deleteOne();
    res.json({ message: 'Meditation session removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Meditation session not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;

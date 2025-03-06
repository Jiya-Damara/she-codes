const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const protect = require('../middleware/auth');

// @route   POST /api/journals
// @desc    Create a journal entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const journal = await Journal.create({
      user: req.user._id,
      title,
      content,
      mood,
      tags,
    });

    // Increment journal entries count for user
    await User.findByIdAndUpdate(req.user._id, { 
      $inc: { journalEntries: 1 } 
    });

    res.status(201).json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/journals
// @desc    Get all journal entries for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(journals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/journals/:id
// @desc    Get a journal entry by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if journal belongs to user
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/journals/:id
// @desc    Update a journal entry
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    let journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if journal belongs to user
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    journal = await Journal.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        mood,
        tags,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json(journal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/journals/:id
// @desc    Delete a journal entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);

    if (!journal) {
      return res.status(404).json({ message: 'Journal not found' });
    }

    // Check if journal belongs to user
    if (journal.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await journal.deleteOne();

    // Decrement journal entries count for user
    await User.findByIdAndUpdate(req.user._id, { 
      $inc: { journalEntries: -1 } 
    });

    res.json({ message: 'Journal removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = Journal;

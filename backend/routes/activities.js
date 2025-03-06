const express = require('express');
const Activity = require('../models/Activity');
const router = express.Router();

router.get('/', async (req, res) => {
  const activities = await Activity.find();
  res.json(activities);
});

router.post('/', async (req, res) => {
  const newActivity = new Activity(req.body);
  await newActivity.save();
  res.status(201).json(newActivity);
});

module.exports = router;
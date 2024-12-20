const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// Get all events for a user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id }).sort({ start: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new event
router.post('/', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('start', 'Start date is required').not().isEmpty(),
  check('end', 'End date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newEvent = new Event({
      ...req.body,
      user: req.user.id
    });

    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete an event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update event dates (for drag and drop)
router.patch('/:id/dates', auth, async (req, res) => {
  try {
    const { start, end } = req.body;
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { start, end } },
      { new: true }
    );

    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 
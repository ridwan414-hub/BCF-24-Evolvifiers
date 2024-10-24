const express = require('express');
const router = express.Router();
const { createBooking, getBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/book', authMiddleware, createBooking);
router.get('/:id', authMiddleware, getBooking);

module.exports = router;
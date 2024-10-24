const express = require('express');
const router = express.Router();
const trainController = require('../controllers/trainController');

// Routes for Train Service
router.post('/add', trainController.addTrain);               // Add a new train
router.get('/', trainController.getAllTrains);               // Get all trains
router.get('/search', trainController.searchTrains);         // Search trains
router.get('/:id', trainController.getTrainById);            // Get train by ID

module.exports = router;

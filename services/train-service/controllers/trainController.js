const trainService = require('../services/trainService');

// Add a new train
const addTrain = async (req, res) => {
    try {
        const trainData = req.body;
        const train = await trainService.addTrain(trainData);
        res.status(201).json(train);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all trains
const getAllTrains = async (req, res) => {
    try {
        const trains = await trainService.getAllTrains();
        res.status(200).json(trains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get train by ID
const getTrainById = async (req, res) => {
    try {
        const train = await trainService.getTrainById(req.params.id);
        if (!train) {
            return res.status(404).json({ message: "Train not found" });
        }
        res.status(200).json(train);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Search trains by source and destination
const searchTrains = async (req, res) => {
    try {
        const { source, destination } = req.query;
        const trains = await trainService.searchTrains(source, destination);
        res.status(200).json(trains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSeatStatus = async (req, res) => {
    try {
        const { trainId, seatNumber } = req.params;
        const status = await trainService.getSeatStatus(trainId, parseInt(seatNumber));
        res.status(200).json({ status });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    addTrain,
    getAllTrains,
    getTrainById,
    searchTrains,
    getSeatStatus
};
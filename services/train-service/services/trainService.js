const Train = require('../models/Train');

// Add a new train
const addTrain = async (trainData) => {
    const train = new Train(trainData);
    return await train.save();
};

// Fetch all trains
const getAllTrains = async () => {
    return await Train.find({});
};

// Fetch train by ID
const getTrainById = async (id) => {
    return await Train.findById(id);
};

// Search trains by source and destination
const searchTrains = async (source, destination) => {
    return await Train.find({ source, destination });
};

module.exports = {
    addTrain,
    getAllTrains,
    getTrainById,
    searchTrains
};

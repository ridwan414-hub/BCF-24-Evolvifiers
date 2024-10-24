const Train = require('../models/Train');
const amqp = require('amqplib');
const Redis = require('ioredis');

const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT || 6379;

const redis = new Redis({
    host,
    port
});

if (redis) {
    console.error('Redis connection successful');
} else {
    console.error('Redis connection failed');
}

let channel;

async function connectQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();

        // Assert queue for seat status updates
        await channel.assertQueue('train_seat_updates');

        // Consume messages for seat status updates
        channel.consume('train_seat_updates', async (data) => {
            try {
                const { trainId, seatNumber, status } = JSON.parse(data.content);

                // Create an instance of TrainService
                const trainService = new TrainService();
                await trainService.updateSeatStatus(trainId, seatNumber, status);

                channel.ack(data);
            } catch (error) {
                console.error('Error processing seat update:', error);
                channel.nack(data, false, true); // Requeue the message
            }
        });

        console.log('Train service connected to RabbitMQ');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}
connectQueue();

class TrainService {
    // Existing methods...
    async addTrain(trainData) {
        const train = new Train(trainData);
        await train.save();

        // Cache train data
        await this.cacheTrainData(train);
        return train;
    }

    async getAllTrains() {
        return await Train.find();
    }

    async getTrainById(id) {
        // Try cache first
        const cachedTrain = await redis.get(`train:${id}`);
        if (cachedTrain) {
            return JSON.parse(cachedTrain);
        }

        const train = await Train.findById(id);
        if (train) {
            await this.cacheTrainData(train);
        }
        return train;
    }

    async searchTrains(source, destination) {
        return await Train.find({ source, destination });
    }

    // New methods for seat management
    async updateSeatStatus(trainId, seatNumber, status) {
        try {
            console.log(`Updating seat status for trainId: ${trainId}, seatNumber: ${seatNumber}, status: ${status}`);

            // Update in database
            const train = await Train.findOneAndUpdate(
                {
                    _id: trainId,
                    'seats.seatNumber': seatNumber
                },
                {
                    $set: { 'seats.$.status': status }
                },
                { new: true }
            );

            if (!train) {
                throw new Error('Train or seat not found');
            }

            // Update cache
            await this.cacheTrainData(train);

            // Update individual seat cache
            await redis.set(
                `train:${trainId}:seat:${seatNumber}`,
                status,
                'EX',
                3600 // 1 hour expiry
            );

            return train;
        } catch (error) {
            console.error('Error updating seat status:', error);
            throw error;
        }
    }

    async cacheTrainData(train) {
        await redis.set(
            `train:${train._id}`,
            JSON.stringify(train),
            'EX',
            3600 // 1 hour expiry
        );
    }

    async getSeatStatus(trainId, seatNumber) {
        // Try cache first
        const cachedStatus = await redis.get(`train:${trainId}:seat:${seatNumber}`);
        if (cachedStatus) {
            return cachedStatus;
        }

        // If not in cache, get from database
        const train = await Train.findById(trainId);
        if (!train) {
            throw new Error('Train not found');
        }

        const seat = train.seats.find(s => s.seatNumber === seatNumber);
        if (!seat) {
            throw new Error('Seat not found');
        }

        // Cache the result
        await redis.set(
            `train:${trainId}:seat:${seatNumber}`,
            seat.status,
            'EX',
            3600
        );

        return seat.status;
    }
}

module.exports = new TrainService();

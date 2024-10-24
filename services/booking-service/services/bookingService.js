const Redis = require('ioredis');
const amqp = require('amqplib');
const Booking = require('../models/Booking');


const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT || 6379;

const redis = new Redis({
    host,
    port,
});

if (redis) {
    console.error('Redis connection successful');
} else {
    console.error('Redis connection failed');
}

let channel;

// Connect to RabbitMQ
async function connectQueue() {
    try {
        const connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('payment_queue');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}
connectQueue();

class BookingService {
    async createBooking(trainId, userId, seatNumber, price) {
        // Check seat availability in Redis
        const seatKey = `train:${trainId}:seat:${seatNumber}`;
        const seatStatus = await redis.get(seatKey);

        if (seatStatus === 'booked') {
            throw new Error('Seat already booked');
        }

        // Create booking
        const booking = new Booking({
            trainId,
            userId,
            seatNumber,
            price
        });
        await booking.save();

        // Reserve seat in Redis
        await redis.set(seatKey, 'booked', 'EX', 300); // 5 minutes expiry

        // Send to payment queue
        await channel.sendToQueue(
            'payment_queue',
            Buffer.from(JSON.stringify({
                bookingId: booking._id,
                amount: price,
                userId
            }))
        );

        await channel.sendToQueue(
            'train_seat_updates',
            Buffer.from(JSON.stringify({
                trainId,
                seatNumber,
                status: 'reserved'
            }))
        );

        return booking;
    }

    async updateBookingStatus(bookingId, status) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        booking.status = status;
        await booking.save();

        // Determine seat status based on booking status
        let seatStatus;
        switch (status) {
            case 'confirmed':
                seatStatus = 'booked';
                break;
            case 'cancelled':
                seatStatus = 'available';
                break;
            default:
                seatStatus = 'reserved';
        }

        // Notify train service about seat status change
        await channel.sendToQueue(
            'train_seat_updates',
            Buffer.from(JSON.stringify({
                trainId: booking.trainId,
                seatNumber: booking.seatNumber,
                status: seatStatus
            }))
        );

        return booking;
    }

    async getBooking(bookingId) {
        return await Booking.findById(bookingId);
    }
}

module.exports = new BookingService();

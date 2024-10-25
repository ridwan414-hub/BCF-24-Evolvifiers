const Redis = require('ioredis');
const amqp = require('amqplib');
const Booking = require('../models/Booking');
const OTPService = require('../../payment-service/services/otpService');


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
    async createBooking(trainId, userId, seatNumber, price, userEmail) {
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
        await redis.set(seatKey, 'pending', 'EX', 300); // 5 minutes expiry

        // Send to payment queue
        await channel.sendToQueue(
            'payment_queue',
            Buffer.from(JSON.stringify({
                trainId,
                seatNumber,
                status: 'pending',
                bookingId: booking._id,
                amount: price,
                userId
            }))
        );

        // Send to notification queue for booking confirmation
        await channel.sendToQueue(
            'notification_queue',
            Buffer.from(JSON.stringify({
                type: 'email',
                userEmail: userEmail,
                details: {
                    _id: booking._id,
                    ticket: {
                        train_id: trainId,
                        seat_id: seatNumber
                    },
                    price,
                    bookingDate: new Date()
                }
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

    async generateAndSendOTP(userId, email) {
        const otp = await OTPService.generateOTP(userId);

        // Send OTP to notification queue
        await channel.sendToQueue(
            'notification_queue',
            Buffer.from(JSON.stringify({
                type: 'otp',
                email,
                otp
            }))
        );

        return otp;
    }

    async updateBookingStatusFromQueue() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            const queue = 'booking_status_updates';

            await channel.assertQueue(queue, { durable: true });
            console.log('Booking status consumer waiting for messages...');

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const { bookingId, status } = JSON.parse(msg.content.toString());
                    try {
                        await this.updateBookingStatus(bookingId, status);
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error updating booking status:', error);
                        channel.nack(msg);
                    }
                }
            });
        } catch (error) {
            console.error('Booking status consumer error:', error);
        }
    }
}

module.exports = new BookingService();

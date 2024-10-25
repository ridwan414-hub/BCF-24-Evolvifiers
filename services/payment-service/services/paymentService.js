const amqp = require('amqplib');
const Payment = require('../models/Payment');

let channel;

// Connect to RabbitMQ
async function connectQueue() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('booking_status_updates');
        await channel.assertQueue('train_seat_updates');
    } catch (error) {
        console.error('RabbitMQ connection error:', error);
    }
}
connectQueue();

class PaymentService {
    async processPayment(paymentData) {
        const { bookingId, userId, amount, trainId, seatNumber, status } = paymentData;

        // Create a new payment record
        const payment = new Payment({
            bookingId,
            userId,
            amount
        });

        // Simulate payment processing
        try {
            // Assume payment is successful
            payment.status = 'completed';
            await payment.save();

            // Notify booking service about payment completion
            await channel.sendToQueue(
                'booking_status_updates',
                Buffer.from(JSON.stringify({
                    bookingId,
                    status: 'confirmed'
                }))
            );

            // Notify train service about seat status change
            await channel.sendToQueue(
                'train_seat_updates',
                Buffer.from(JSON.stringify({
                    bookingId,
                    trainId,
                    seatNumber,
                    status: 'booked'
                }))
            );

            console.log(`Payment completed for booking ID: ${bookingId}`);

            return payment;
        } catch (error) {
            payment.status = 'failed';
            await payment.save();
            throw new Error('Payment processing failed');
        }
    }
}

module.exports = new PaymentService();

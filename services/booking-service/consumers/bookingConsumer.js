// consumers/bookingConsumer.js
const amqp = require('amqplib');
const BookingService = require('../services/bookingService');

class BookingConsumer {
    async start() {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            const queue = 'booking_queue';

            await channel.assertQueue(queue, { durable: true });
            console.log('Booking consumer waiting for messages...');

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const bookingData = JSON.parse(msg.content.toString());
                    try {
                        await BookingService.processBookingConfirmation(bookingData.bookingId);
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing booking:', error);
                        // Implement retry logic or dead letter queue here
                        channel.nack(msg);
                    }
                }
            });
        } catch (error) {
            console.error('Consumer error:', error);
        }
    }
}

module.exports = new BookingConsumer();
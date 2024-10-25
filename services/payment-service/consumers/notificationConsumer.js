const amqp = require('amqplib');
const EmailService = require('../services/mailService');
const OTPService = require('../services/otpService');

class NotificationConsumer {
    async start() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            const queue = 'notification_queue';

            await channel.assertQueue(queue, { durable: true });
            console.log('Notification consumer waiting for messages...');

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    try {
                        const rawMessage = msg.content.toString();
                        console.log('Received message:', rawMessage);
                        const bookingData = JSON.parse(rawMessage);
                        console.log('Parsed booking data:', bookingData);
                        await EmailService.sendBookingConfirmation(bookingData);
                    } catch (error) {
                        console.error('Error processing notification:', error);
                    }
                    channel.ack(msg);
                }
            });
        } catch (error) {
            console.error('Notification consumer error:', error);
        }
    }
}

module.exports = new NotificationConsumer();

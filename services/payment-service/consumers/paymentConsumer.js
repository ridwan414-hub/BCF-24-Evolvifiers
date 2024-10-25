const amqp = require('amqplib');
const PaymentService = require('../services/paymentService');

class PaymentConsumer {
    async start() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            const queue = 'payment_queue';

            await channel.assertQueue(queue, { durable: true });
            console.log('Payment consumer waiting for messages...');

            channel.consume(queue, async (msg) => {
                if (msg !== null) {
                    const paymentData = JSON.parse(msg.content.toString());
                    try {
                        await PaymentService.processPayment(paymentData);
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Error processing payment:', error);
                        channel.nack(msg);
                    }
                }
            });
        } catch (error) {
            console.error('Consumer error:', error);
        }
    }
}

module.exports = new PaymentConsumer();

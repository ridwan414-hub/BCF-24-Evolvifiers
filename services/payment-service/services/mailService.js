const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendBookingConfirmation(booking) {
        if (!booking) {
            throw new Error('Booking object is undefined');
        }

        if (!booking.details.ticket.train_id) {
            throw new Error('Booking object is missing train_id');
        }

        const emailContent = `
            Thank you for your booking!
            Train ID: ${booking.details.ticket.train_id}
            Booking ID: ${booking._id}
            From: ${process.env.SMTP_USER}
            To: ${booking.details.userEmail}
            Date: ${new Date(booking.details.bookingDate).toLocaleDateString()}
            Seat: ${booking.details.ticket.seat_id}
        `;

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: booking.details.userEmail,
            subject: 'Booking Confirmation',
            text: emailContent
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Confirmation email sent for booking ID: ${booking._id}`);
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw error;
        }
    }

    async sendOTP(email, otp) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your OTP for Booking Verification',
            html: `
                <h1>Booking Verification Code</h1>
                <p>Your OTP for booking verification is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 5 minutes.</p>
            `
        };

        return await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();

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

    async sendBookingConfirmation(userEmail, bookingDetails) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: userEmail,
            subject: 'Booking Confirmation',
            html: `
                <h1>Booking Confirmed!</h1>
                <p>Your booking has been confirmed with the following details:</p>
                <ul>
                    <li>Booking ID: ${bookingDetails._id}</li>
                    <li>Train: ${bookingDetails.ticket.train_id}</li>
                    <li>Seat: ${bookingDetails.ticket.seat_id}</li>
                    <li>Price: $${bookingDetails.price}</li>
                    <li>Date: ${bookingDetails.bookingDate}</li>
                </ul>
            `
        };

        return await this.transporter.sendMail(mailOptions);
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
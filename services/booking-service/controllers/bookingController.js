const BookingService = require('../services/bookingService');

const createBooking = async (req, res) => {
    try {
        const { trainId, seatNumber, price, userEmail } = req.body;
        const userId = req.user.id; // Assuming auth middleware

        const booking = await BookingService.createBooking(
            trainId,
            userId,
            seatNumber,
            price,
            userEmail
        );
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBooking = async (req, res) => {
    try {
        const booking = await BookingService.getBooking(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createBooking, getBooking };
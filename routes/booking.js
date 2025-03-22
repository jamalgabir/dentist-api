const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const appointment = require ("../models/Appointment")
router.post('/book-appointment', async (req, res) => {
    const { patientName, email, phone, date, time, serviceType } = req.body;

    try {
        const newBooking = new appointment({ patientName, email, phone, date, time, serviceType });
        await newBooking.save();
        res.status(201).json({ message: 'Booking confirmed!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create booking', error });
    }
});

module.exports = router;

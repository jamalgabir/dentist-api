const express = require("express")
const router = express.Router();
const Appointment = require('../models/Appointment');
const  protectAdminRoute  = require("../middleware/authMiddleware");

// adminRoutes.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.get('/admin/verify-token', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.adminId);

        if (!admin) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});


router.get('/admin/appointments',protectAdminRoute, async (req, res) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ message: 'Server error fetching appointments' });
    }
});
// routesRoutes.js

// Create a new appointment
router.post('/admin/appointments',protectAdminRoute, async (req, res) => {
    const { patientName, email, phone, serviceType, date } = req.body;

    try {
        const newAppointment = new Appointment({
            patientName,
            email,
            phone,  // Include phone
            serviceType,  // Include service type
            date,
        });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Server error creating appointment' });
    }
});

// Update an existing appointment
router.put('/admin/appointments/:id',protectAdminRoute, async (req, res) => {
    const { patientName, email, phone, serviceType, date } = req.body;
    const { id } = req.params;

    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
            patientName,
            email,
            phone,  // Include phone
            serviceType,  // Include service type
            date,
        }, { new: true });

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Server error updating appointment' });
    }
});

// Cancel (delete) an appointment
router.delete('/admin/appointments/:id',protectAdminRoute, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ message: 'Server error cancelling appointment' });
    }
});
module.exports = router;

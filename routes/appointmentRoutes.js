// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Get available appointment slots for booking
// routes/appointmentRoutes.js
// routes/appointmentRoutes.js
// routes/appointmentRoutes.js
router.get('/available-slots', async (req, res) => {
    const now = new Date();  // Current date and time

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1); // One month ahead

    const workingHours = [];
    
    // Generate working hours for the next month, starting from today
    for (let d = new Date(now); d <= oneMonthLater; d.setDate(d.getDate() + 1)) {
        // Ensure slots are generated for Monday to Friday only
        if (d.getDay() !== 0 && d.getDay() !== 6) {  // 0 = Sunday, 6 = Saturday
            for (let hour = 8; hour <= 17; hour++) {  // 8 AM to 5 PM (each slot lasts 1 hour)
                const slot = new Date(d);
                slot.setHours(hour, 0, 0, 0); // Set the slot hour (no minutes, seconds, or ms)
                if (slot > now) { // Only add slots that are in the future
                    workingHours.push(new Date(slot));
                }
            }
        }
    }

    // Fetch booked appointments
    const bookedAppointments = await Appointment.find({
        date: {
            $gte: now,  // Only future appointments
            $lt: oneMonthLater,
        },
    });

    // Filter out booked slots
    const bookedSlots = bookedAppointments.map(appt => appt.date.toISOString());
    const availableSlots = workingHours.filter(slot => {
        return !bookedSlots.includes(slot.toISOString()); // Keep unbooked slots
    });

    res.json({ slots: availableSlots });
});



module.exports = router;

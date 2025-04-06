// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true,  // Ensures no double bookings for the same time slot
    },
    patientName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {  // New phone field
        type: String,
        required: true,
    },
    serviceType: {  // New service type field
        type: String,
        required: true,
    },
    attended:{ type: Boolean,
        default: false,
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

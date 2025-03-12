// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const appointmentRoutes = require('./routes/appointmentRoutes');
const booking = require("./routes/booking")
const adminRoutes = require("./routes/adminRoutes")
const adminLongin = require("./routes/loginRoutes")
const adminRegister = require("./routes/registerRoutes")
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', appointmentRoutes);
app.use("/api", booking);
app.use("/api", adminRoutes);
app.use("/api", adminLongin)
app.use("/api", adminRegister)

// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

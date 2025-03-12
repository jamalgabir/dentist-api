// controllers/authController.js
const Admin = require('../models/admin'); // Import the Admin model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
require('dotenv').config();


exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Check if admin exists
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send the token to the client
        res.json({ token });
    } catch (error) {
        console.error('Server error during admin login', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.adminRegister = async (req, res) => {
    const { name, email, password, secretKey } = req.body;

    // A hardcoded secret key to prevent open registration (can be stored in .env)
    const allowedSecretKey = process.env.ADMIN_SECRET_KEY || "1212" ;

    if (secretKey !== allowedSecretKey) {
        return res.status(403).json({ message: 'Invalid secret key' });
    }

    try {
        // Check if admin already exists
        let admin = await Admin.findOne({ email });
        if (admin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new admin
        admin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        // Save the new admin to the database
        await admin.save();

        // Generate a JWT token
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Send the token to the client
        res.status(201).json({ token, message: 'Admin registered successfully' });
    } catch (error) {
        console.error('Server error during admin registration:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
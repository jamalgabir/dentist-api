const express = require('express');
const router = express.Router();
const { adminRegister } = require('../controllers/authController');

// Register a new admin
router.post('/admin/register', adminRegister);

module.exports = router;

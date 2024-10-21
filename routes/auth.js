const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use 'gmail' or another email service
    auth: {
        user: 'imranmohd261996@gmail.com', // Your email
        pass: 'hcpj hxaa lyxo etun' // Your password or app-specific password
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the password is strong enough (minimum 5 characters)
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
        if (!passwordPattern.test(password)) {
            return res.status(400).send('Password must be at least 5 characters long and include at least one letter, one special character, and one digit.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

        const mailOptions = {
            from: 'imranmohd261996@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`
        };

        // Send mail using Nodemailer
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending OTP:', error.message);
                return res.status(500).json({ message: 'Error sending OTP. Please try again later.' });
            }

            console.log('Email sent: ' + info.response);
            // Store user data in session for OTP verification
            req.session.username = username;
            req.session.password = hashedPassword; // In a real app, you would save this to a database
            req.session.otp = otp; // Store the generated OTP in session
            return res.redirect('/otp'); // Redirect to OTP verification page
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// OTP verification route
router.post('/otp', (req, res) => {
    const { enteredOtp } = req.body;

    // Validate the entered OTP
    if (enteredOtp === req.session.otp) {
        // If valid, redirect to login
        return res.redirect('/login');
    } else {
        return res.status(400).send('Invalid OTP. Please try again.');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Dummy check. Replace this with actual authentication logic
    if (username === req.session.username) {
        const match = await bcrypt.compare(password, req.session.password);
        if (match) {
            // Assuming this is the user data retrieved from your database
            req.session.user = {
                username: username,
                department: 'civil' // Replace with actual department from database
            };
            req.session.loggedIn = true;
            return res.redirect('/');  // Redirect to home page after successful login
        }
    }
    res.status(401).send('Invalid credentials');  // Handle invalid login
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login'); // Redirect to login page after logout
});

module.exports = router;


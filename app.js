const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Session setup
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Simulated user storage
const users = [];

// Function to send OTP email
function sendOtpEmail(email, otp) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'imranmohd261996@gmail.com',
            pass: 'hcpj hxaa lyxo etun'
        }
    });

    let mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}`
    };

    return transporter.sendMail(mailOptions);
}

// Render Home Page
app.get('/', (req, res) => {
    const user = req.session.user || {}; // Ensure user is always an object
    res.render('index', { user });
});

// Render Register Page
app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Handle Register Form Submission
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate random 6-digit OTP

    // Store OTP and user details in the session
    req.session.tempUser = { email, password, otp };

    // Send OTP to user's email
    sendOtpEmail(email, otp)
        .then(() => {
            res.redirect('/verify-otp'); // Redirect to OTP verification page
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.render('register', { error: 'Failed to send OTP. Please try again.' });
        });
});

// Render OTP Verification Page
app.get('/verify-otp', (req, res) => {
    res.render('verify-otp', { error: null });
});

// Handle OTP Verification
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;

    if (req.session.tempUser && req.session.tempUser.otp == otp) {
        // OTP is correct, save the user
        users.push({
            email: req.session.tempUser.email,
            password: req.session.tempUser.password,
            department: 'civil', // For simplicity, setting department to 'civil'
            loggedIn: false
        });

        // Clear temporary user and redirect to login
        delete req.session.tempUser;
        res.redirect('/login');
    } else {
        // OTP is incorrect
        res.render('verify-otp', { error: 'Invalid OTP. Please try again.' });
    }
});

// Render Login Page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle Login Form Submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find the user
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // User found, log in and redirect to dashboard
        req.session.user = { ...user, loggedIn: true };
        res.redirect('/');
    } else {
        // Invalid credentials
        res.render('login', { error: 'Invalid email or password.' });
    }
});

// Render Upload Drawings Page
app.get('/upload', (req, res) => {
    const user = req.session.user || {};
    if (user.loggedIn) {
        res.render('upload-drawings', { user });
    } else {
        res.redirect('/login');
    }
});

// Render View/Download Drawings Page
app.get('/files', (req, res) => {
    const user = req.session.user || {};
    if (user.loggedIn) {
        res.render('view-download-drawings', { user });
    } else {
        res.redirect('/login');
    }
});

// Render Approvals Page
app.get('/approvals', (req, res) => {
    const user = req.session.user || {};
    if (user.loggedIn) {
        res.render('approvals', { user });
    } else {
        res.redirect('/login');
    }
});

// Render Progress Tracking Page
app.get('/progress', (req, res) => {
    const user = req.session.user || {};
    if (user.loggedIn) {
        res.render('progress-tracking', { user });
    } else {
        res.redirect('/login');
    }
});

// Handle Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Handle 404 Errors (Optional)
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


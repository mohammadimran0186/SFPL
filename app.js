const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

// Import routes for civil management
const indexRoutes = require('./routes/index');    // Home page routes
const uploadRoutes = require('./routes/upload');  // Upload page routes
const fileRoutes = require('./routes/files');     // View/Download drawings page routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simulated user storage (replace with DB for production)
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

// Render home page
app.get('/', (req, res) => {
    const user = req.session.user || {}; 
    res.render('index', { user });
});

// Registration page
app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Handle registration form submission
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP and user details in session
    req.session.tempUser = { email, password, otp };

    sendOtpEmail(email, otp)
        .then(() => {
            res.redirect('/verify-otp');
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            res.render('register', { error: 'Failed to send OTP. Please try again.' });
        });
});

// OTP verification page
app.get('/verify-otp', (req, res) => {
    res.render('verify-otp', { error: null });
});

// Handle OTP verification
app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (req.session.tempUser && req.session.tempUser.otp == otp) {
        users.push({
            email: req.session.tempUser.email,
            password: req.session.tempUser.password,
            department: 'civil',
            loggedIn: false
        });
        delete req.session.tempUser;
        res.redirect('/login');
    } else {
        res.render('verify-otp', { error: 'Invalid OTP. Please try again.' });
    }
});

// Login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        req.session.user = { ...user, loggedIn: true };
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid email or password.' });
    }
});

// Logout functionality
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Civil engineering management routes (protected by login)
app.use('/', (req, res, next) => {
    const user = req.session.user || {};
    if (user.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
});

app.use('/', indexRoutes);      // Home page
app.use('/upload', uploadRoutes);  // Upload page
app.use('/files', fileRoutes);     // View/Download drawings page

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


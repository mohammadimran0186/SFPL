const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
}

// Home page route (index)
router.get('/', isAuthenticated, (req, res) => {
    // Pass the session user to the view
    res.render('index', { user: req.session.user });
});

// Route to view uploaded drawings
router.get('/files', isAuthenticated, (req, res) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Adjust the path based on your structure

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.render('files', { files, user: req.session.user });
    });
});

// Route for progress tracking
router.get('/progress', isAuthenticated, (req, res) => {
    res.render('progress', { user: req.session.user });
});

// Route for approvals
router.get('/approvals', isAuthenticated, (req, res) => {
    res.render('approvals', { user: req.session.user });
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login');  // Render login.ejs
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');  // Redirect to login after logout
    });
});

module.exports = router;


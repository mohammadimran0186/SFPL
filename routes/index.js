const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Home page
router.get('/', (req, res) => {
    res.render('index');  // Render index.ejs for the home page
});

// Other pages (e.g., progress, approvals)
router.get('/progress', (req, res) => {
    res.render('progress');
});

router.get('/approvals', (req, res) => {
    res.render('approvals');
});

// Route to view uploaded drawings
router.get('/files', (req, res) => {
    const uploadDir = path.join(__dirname, '../uploads'); // Adjust the path based on your structure

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan directory: ' + err);
        }
        res.render('files', { files, query: req.query });
    });
});

module.exports = router;


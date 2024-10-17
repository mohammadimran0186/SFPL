const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Directory where uploaded files are stored
const uploadDir = path.join(__dirname, '../uploads');

// Route to list all uploaded drawings
router.get('/', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to retrieve drawings.');
        }
        res.render('files', { files });  // Render the 'files' view and pass the list of files
    });
});

module.exports = router;


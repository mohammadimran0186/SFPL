const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Render the upload page
router.get('/', (req, res) => {
    res.render('upload');
});

// Handle the upload post request
router.post('/', upload.single('drawing'), (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    console.log('File uploaded:', file);

    // Render the success page with a message
    res.render('uploadSuccess', { filename: file.filename });
});

module.exports = router;


const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);  // Save file with timestamp + original name
    }
});

// Multer upload setup (single file with the 'drawing' field)
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|pdf/;  // Restrict file types
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed!'));
        }
    }
}).single('drawing');  // Accept single file with 'drawing' field

// Render the upload page
router.get('/', (req, res) => {
    res.render('upload');  // Ensure 'upload.ejs' exists in the views folder
});

// Handle the file upload post request
router.post('/', (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle Multer-specific errors
            return res.status(500).send('Multer error occurred: ' + err.message);
        } else if (err) {
            // Handle other errors
            return res.status(500).send('Error occurred: ' + err.message);
        }

        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        console.log('File uploaded successfully:', file.filename);

        // Render success page and show the uploaded file name
        res.render('uploadSuccess', { filename: file.filename });  // Ensure 'uploadSuccess.ejs' exists in the views folder
    });
});

module.exports = router;


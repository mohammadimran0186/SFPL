const express = require('express');
const uploadController = require('../controllers/uploadController');
const router = express.Router();

// Upload page
router.get('/', (req, res) => {
  res.render('upload');
});

// Handle file upload
router.post('/', uploadController.uploadFile);

module.exports = router;

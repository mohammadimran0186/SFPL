const multer = require('multer');
const path = require('path');
const emailController = require('./emailController');

// Set up storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // Local folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Unique filename
  }
});
const upload = multer({ storage }).single('drawing');

// Upload function
exports.uploadFile = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).send('Error uploading file.');
    }

    const { comment, email } = req.body;
    if (!comment) {
      return res.status(400).send('Please add a comment.');
    }

    // Send email notification (if email provided)
    if (email) {
      emailController.sendNotification(email, comment, req.file.filename);
    }

    // Return success response
    res.status(200).send({
      message: 'File uploaded successfully',
      fileName: req.file.filename,
      comment: comment
    });
  });
};

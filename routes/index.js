const express = require('express');
const router = express.Router();

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

module.exports = router;

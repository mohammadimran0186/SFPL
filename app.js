const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', indexRoutes);
app.use('/upload', uploadRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

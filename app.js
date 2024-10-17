const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const indexRoutes = require('./routes/index');    // Home page routes
const uploadRoutes = require('./routes/upload');  // Upload page routes
const fileRoutes = require('./routes/files');     // View/Download drawings page routes

const app = express();
const PORT = process.env.PORT || 80;

// Middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static files (CSS, images, client-side scripts)
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Setting EJS as the template/view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // View directory

// Routes Setup
app.use('/', indexRoutes);      // Home page
app.use('/upload', uploadRoutes);  // Upload page
app.use('/files', fileRoutes);     // View/Download drawings page

// Error handling - useful for catching issues
app.use((req, res) => {
    res.status(404).send('Page not found!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


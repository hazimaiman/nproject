// Importing required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const api = require("./routes/api")
const morgan = require('morgan');

// Creating an instance of the Express application
const app = express();

// Enabling CORS for requests from the frontend
app.use(cors({
  origin: 'http://localhost:3000',  // Allowing only frontend running on this URL
}));

// Adding request logging middleware
app.use(morgan('combined'));

// Middleware to parse JSON bodies
app.use(express.json());


// Serving static files from the public directory
app.use(express.static(path.join(__dirname, "..", 'public')));

app.use("/v1", api);


// Catch-all route to serve the frontend application
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Exporting the app for use in server.js
module.exports = app;

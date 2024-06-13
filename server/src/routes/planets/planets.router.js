// Importing required modules
const express = require('express');
const { httpGetAllPlanets } = require('./planets.controller'); // Corrected import

// Creating a new router object
const planetsRouter = express.Router();

// Defining a GET route for /planets
planetsRouter.get('/', httpGetAllPlanets); // Corrected function name

// Exporting the router
module.exports = planetsRouter;

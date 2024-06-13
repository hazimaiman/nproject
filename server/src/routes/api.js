const express = require('express')

const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");

const api = express.Router();

// Using the planets router for /planets endpoint
api.use("/planets", planetsRouter);  // Corrected the space issue

// Using the launches router for /launches endpoint
api.use("/launches", launchesRouter);


module.exports = api;
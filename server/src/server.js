// Importing required modules
const http = require('http');
const app = require('./app');
require('dotenv').config();
const {mongoConnect} = require('./services/mongo')
const { loadPlanetsData } = require('./models/planets.model');
const {loadLaunchData} = require ('./models/launches.model')

// Setting the port for the server
const PORT = process.env.PORT || 8000;


// Creating an HTTP server with the Express app
const server = http.createServer(app);



// Function to start the server
async function startServer() {
  await mongoConnect();
  // Loading planet data before starting the server
  await loadPlanetsData();

  await loadLaunchData();
  // Starting the server and listening on the specified port
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

// Starting the server
startServer();


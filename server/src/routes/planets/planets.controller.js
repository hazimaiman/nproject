// Importing the planets data from the model
const { getAllPlanets } = require('../../models/planets.model');

// Controller function to handle GET requests for /planets
async function httpGetAllPlanets(req, res) {
  // Sending the list of planets as a JSON response
  return res.status(200).json(await getAllPlanets());
}

// Exporting the controller function
module.exports = {
  httpGetAllPlanets,
};

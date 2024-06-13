// Importing required modules
const path = require('path');
const { parse } = require('csv-parse');
const fs = require('fs');
const planets = require('./planets.mongo');

// Function to check if a planet is habitable
function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

// Function to load planet data from a CSV file
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    // Reading the CSV file
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',  // Ignoring comment lines
        columns: true, // Parsing CSV columns into objects
      }))
      .on('data', async (data) => {
        // Adding habitable planets to the array
        if (isHabitablePlanet(data)) {
          await savePlanets(data);
        }
      })
      .on('error', (err) => {
        // Logging and rejecting on error
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        // Logging the number of habitable planets found and resolving the promise
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets found!`);
        resolve();
      });
  });
}

// Function to get all planets from the database
async function getAllPlanets() {
  return await planets.find({},{
    '_id':0, "__v":0,
  });

}

// Function to save a planet to the database
async function savePlanets(planet) {
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name,
    }, {
      keplerName: planet.kepler_name,
    }, {
      upsert: true,
    });
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
}

// Exporting the loadPlanetsData function and getAllPlanets function
module.exports = {
  loadPlanetsData,
  getAllPlanets,
};

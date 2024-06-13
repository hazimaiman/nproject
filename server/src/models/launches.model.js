const launchesDatabase = require("./launches.mongo");
const axios = require("axios");
const planets = require('./planets.mongo');
const DEFAULT_FLIGHT_NUMBER = 100;

async function loadLaunchData(){
    const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

    async function populateLaunches(){
        console.log("Downloading launch data");

        const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select: {
                            name: 1
                        }
                    },
                    {
                        path: 'payloads',
                        select: {
                            'customers': 1
                        }
                    }
                ]
            }
        });

        if (response.status !==  200){
            console.log('Problem download launch data');
            throw new Error('Launch data download failder')
        }
    
        const launchDocs = response.data.docs;
        for (const launchDoc of launchDocs) {
            const payloads = launchDoc['payloads'];
            const customers = payloads.flatMap((payload) => {
                return payload['customers'];
            });
    
            const launch = {
                flightNumber: launchDoc['flight_number'],
                mission: launchDoc['name'],
                rocket: launchDoc['rocket']['name'],
                launchDate: launchDoc['date_local'],
                target: "N/A", // target is not provided by SpaceX API, set it to "N/A" or remove this line
                upcoming: launchDoc['upcoming'],
                success: launchDoc['success'],
                customers,
            };
    
            console.log(`${launch.flightNumber} ${launch.mission}`);
            await saveLaunch(launch); // Save each launch to the database
        }

    }

    async function loadLaunchData() {
        const firstLaunch = await findLaunch({
            flightNumber: 1,
            rocket: 'Falcon1',
            mission: 'FalconSat',
        });
        if (firstLaunch){
            console.log('Launch data already loaded')
            
        } else {
            await populateLaunches();
        }
    }
   
}

async function findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber:launchId
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne({})
        .sort('-flightNumber');

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(skip,limit) {
    return await launchesDatabase
    .find({}, {'_id': 0, '__v': 0,})
    .sort({flightNumber : 1})
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
    if (launch.target && launch.target !== "N/A") {
        const planet = await planets.findOne({
            keplerName: launch.target,
        });
        if (!planet) {
            throw new Error('No matching planet found');
        }
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    });
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = {
        ...launch,
        success: true,
        upcoming: true,
        customers: ["Yb GANU", "Matsaid"],
        flightNumber: newFlightNumber,
    };

    await saveLaunch(newLaunch);
    return newLaunch;
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};

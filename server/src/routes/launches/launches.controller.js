const { getAllLaunches, existLaunchWithId, abortLaunchById, scheduleNewLaunch } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    console.log("Received launch data:", launch);

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing required launch property"
        });
    }

    launch.launchDate = new Date(launch.launchDate);
    console.log("Parsed launch date:", launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Launch Date'
        });
    }

    try {
        const newLaunch = await scheduleNewLaunch(launch);
        return res.status(201).json(newLaunch);
    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    const exists = await existLaunchWithId(launchId);

    if (!exists) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    }
    const aborted = await abortLaunchById(launchId);

    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted"
        });
    }
    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};

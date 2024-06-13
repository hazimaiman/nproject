
// TODO: Once API is ready.
// Load planets and return as JSON.
// URL of the backend API
const API_URL = "http://localhost:8000/v1";

// Function to fetch planets from the backend
async function httpGetPlanets() {
  // Sending a GET request to the /planets endpoint of the API
  const response = await fetch(`${API_URL}/planets`);
  // Parsing the response as JSON
  return response.json();
}


async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.

  const response = await fetch (`${API_URL}/launches`)

  const fetchLaunches =  await response.json();
  return fetchLaunches.sort((a,b )=> {
    return a.flightNumber - b.flightNumber;
  })
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
  } catch(err) {
    return {
      ok: false,
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
  return await fetch(`${API_URL}/launches/${id}`,{
    method: "delete",
  })} catch(err){
    console.log(err);
    return{
      ok: false,
    }
  };
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};
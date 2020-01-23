const DistrictModel = require('../models/District');
const districtController = require("./districtController");
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

const runSimulation = async function() {
  try {
    // Generate based on district, not voters, because there is no guarantee that randomuser.me 
    // generated people in each district. In fact, we now know that randomuser.me generated addresses
    // that don't exist.

    // Load all of the districts from the database. 

    // For each district:
    //   1. Randomly generate a number. This number corresponds to the array index of the parties in the database.
    //   2. Load the district boundaries from the model.
    //   3. Load the party colour that corresponds to the winning party, unknown party, or independent
    //   4. Colour the district with hat colour.

    let districts = await districtController.getDistricts();
    log.debug("runSimulation districts length is ", districts.length);
    for(let i=0; i<districts.length; i++) {
      let district = districts[i];
      let parties = district.parties[0]; // parties was stored in the database as an array of arrays 
      // Generate a random number between 0 and party.length-1
      // Math.floor will round down, meaning we would get a number between 0 and the length
      // Math.ceil would round up, meaning a number between 1 and party.length
      // The generated index represents the party that was voted in.
      var partyIndex = Math.floor(Math.random() * (parties.length));

      // Update the database document with the winner
      await districtController.enterPartySeat(district, parties[partyIndex]);
      district.seat = parties[partyIndex]; // set the local copy as well
    }

    return districts; // Return districts so that the UI knows which party 'won'
  } catch ( error ) {
    log.error(error);

    return [];
  }
}

// Set the votes back to 0 so that we can run the simulation again
const resetSimulation = async function() {
  try {
    console.log("Simulation controller reset simulation");
    await districtController.resetPartySeats();
    console.log("Simulation controller here");
    let districts = await districtController.getDistricts();
    console.log("Simulation controller here2");
    return districts; // simulation reset
  } catch ( error ) {
    log.error(error);
    console.log(error);
    console.log("simluation controller here3");
    return false;
  }

}

module.exports = {
  runSimulation : runSimulation,
  resetSimulation : resetSimulation
};


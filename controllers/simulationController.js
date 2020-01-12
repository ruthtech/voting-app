const DistrictModel = require('../models/District');
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

const runSimulation = async function() {
  // Generate based on district, not voters, because there is no guarantee that randomuser.me 
  // generated people in each district. In fact, we now know that randomuser.me generated addresses
  // that don't exist.

  // Load all of the districts from the database. 

  // For each district:
  //   1. Choose a number of 'votes' to count.
  //   2. Load the district boundaries from the model.
  //   3. Load the party colour that corresponds to the winning party, unknown party, or independent
  //   4. Colour in the district that that colour.

  // for await (const voterList of VoterModel.findOne()) {
  //   let postcode = voterList.location.postcode.replace(/\s/g, "");
  //   await setInterval(async function() {
  //     //   await console.log(
  //     //     `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
  //     //   );
  //     let district = await axios.get(
  //       `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
  //     );
  //     await console.log(
  //       "District is ",
  //       district.data.representatives_centroid[0].district_name
  //     );

  //     //   let candidateList = await db.candidate.find({
  //     //     district_name: district.data.representatives_centroid[0].district_name
  //     //   });
  //     //   console.log("Candidate list is ", candidateList);

  //     //   if (candidateList.length > 0) {
  //     //     let newVoteTally = await db.candidate.findOneAndUpdate(
  //     //       {
  //     //         _id:
  //     //           candidateList[Math.floor(Math.random() * candidateList.length)]
  //     //             ._id
  //     //       },
  //     //       { $inc: { votes_for: 1 } }
  //     //     );

  //     //     let voteCast = await db.voter.findOneAndUpdate(
  //     //       { _id: voterList._id },
  //     //       { $set: { hasvoted: true } }
  //     //     );
  //     // Math.floor(Math.random() * candidateList.length);
  //     //   }
  //     console.log(voterList.name);
  //   }, 60000);
  // }

  return true; // simulation run
};

// Set the votes back to 0 so that we can run the simulation again
const resetSimulation = async function() {
  return true; // simulation reset
}

module.exports = {
  runSimulation : runSimulation,
  resetSimulation : resetSimulation
};


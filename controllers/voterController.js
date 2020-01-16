const VoterModel = require('../models/Voter');
const axios = require("axios");
const addressController = require("./addressController");
const { defaultLocation } = require("./addressController");
const log = require('loglevel');

require('dotenv').config();

if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

const verifyUser = async function(username, password) {
  let data = null;
  try {
    data = await VoterModel.findOne({
      "login.username": username,
      "login.password": password
    }).exec();

    if (!data) {
      log.warn(`No user found for username ${username} with that password.`);
      return false;
    }

    log.debug("retrieved voter is ", data);

    // Now that the database was corrected via method "fixdb", we do not need to check during login
    // if the user's address exists or not. We only need to check during "Edit District" (changing the address).
    //
    // data = await convertToValidAddress(data);

    log.trace("Tracing data transfer 2", data.location);

    // Send back the user that was just found with its calculated district, latitude, and longitude
    let dataClone = addressController.findDistrictNameAndBoundaries(data);
    return dataClone;
  } catch ( err ) {
    log.error("error when find/verify user ", err);
    log.error("find/verify data retrieved was ", data);
    return false;
  }
};

const updateAddress = async function(username, streetNo, streetName, city, province, postcode) {
  let data = null;
  try {
    let data = {
      login: {
        username: username
      },
      location: {
        street: {
          number: streetNo,
          name: streetName
        },
        city: city,
        state: province,
        postcode: postcode,
        coordinates: {
          latitude: 0,
          longitude: 0
        }
      }
    };
    data = await convertToValidAddress(data, true); // force update 

    let dataClone = addressController.findDistrictNameAndBoundaries(data);

    // need to return the user with an "address" as the location object
    return dataClone;
  } catch ( error ) {
    log.error("error when update address", error);
    log.error("update address data retrieved was ", data);
    return false;
  }
};

const enterVote = async function(voterid) {
  log.trace(`votercontroller entering a vote for voter ${voterid}`);

  let voteCast = await VoterModel.findOneAndUpdate(
    { _id: voterid.toString() },
    { $set: { 'hasvoted': true } }
  );
  return voteCast;
};

// randomuser.me generates nonsense for many fields. Each field makes sense in isolation but together they don't exist,
// e.g. a city from one province listed in another province, with a postal code that doesn't exist, 
// latitude and longitude that don't exist, and a timezone in Jakarta. (That's a real example.)
// 
// This method looks at the data to see if it's been converted to a valid address already and if so just returns it.
// If it isn't valid, it does what it needs to to make it valid and then returns it.
async function convertToValidAddress(data, force=false) {
  try {
    // Most of the randomuser.me data is invalid, e.g. a city listed in the wrong province.
    // When this happens, try to look up just the address in Canada. Often it exists.
    // 
    // Start by checking with mapbox (getValidAddress) if the postal code exists. If it does, great. If the address
    // matches then even better. Usually the postal code doesn't exist, and thus you need to update the
    // user's data. 
    // 

    // Do not send the postal code to opennorth until we know that it's a valid one. If a postal code that doesn't
    // exist is sent to opennorth, a 404 is returned and the user can't log in. This method will 
    // sanitize the input for the application so that we can continue. 
    // 

    let address = await addressController.getValidAddress(
      data.location.street.number,
      data.location.street.name,
      data.location.city,
      data.location.state,
      data.location.postcode
    );


    if(address.wasInvalid || force) {
      // Update the database to have the correct postal code, city and province, or the House of Commons.
      // Should the user click "Edit District", they should see the postal code that we are working off of.
      log.trace(`Debugging again. getValidAddress. Before internalUpdate, `, address);
      data = await internalUpdateAddress(
        data.login.username,
        address
      );
      log.trace(`Debugging again. getValidAddress. After internalUpdate ${data}, `);
      log.trace(data.location);
      log.trace(address);
    }

    
    // There seems to be a waiting period between the update call above and when the data is actually updated.
    // Manually update the data now so that everything works as it should.
    data.location.street.number = address.street.number;
    data.location.street.name = address.street.name;
    data.location.city = address.city;
    data.location.state = address.state;
    data.location.postcode = address.postcode;
    data.location.coordinates.latitude = address.coordinates.latitude;
    data.location.coordinates.longitude = address.coordinates.longitude;

    return data;
  } catch ( err ) {
    // If all else fails, update data to the default location
    log.error("Error when converting to valid address ", err);

    data = await internalUpdateAddress(
      data.login.username, 
      defaultLocation
    );

    // // There seems to be a waiting period between the update call above and when the data is actually updated.
    // // Manually update the data now so that everything works as it should.
    data.location.street.number = defaultLocation.street.number;
    data.location.street.name = defaultLocation.street.name;
    data.location.city = defaultLocation.city;
    data.location.state = defaultLocation.state;
    data.location.postcode = defaultLocation.postcode;
    data.location.coordinates.latitude = defaultLocation.coordinates.latitude;
    data.location.coordinates.longitude = defaultLocation.coordinates.longitude;

  }
  return data;
}

const internalUpdateAddress = async function(username, location) {
  const filter = { "login.username": username };
  const update = {
    "location.street.number": location.street.number,
    "location.street.name": location.street.name,
    "location.city": location.city,
    "location.state": location.state,
    "location.postcode": location.postcode,
    "location.coordinates.latitude": location.coordinates.latitude,
    "location.coordinates.longitude": location.coordinates.longitude
  };

  let data = await VoterModel.findOneAndUpdate(filter, update).exec();
  //TODO FIX await data.save();
  return data;
}


// Keep this in to show how we updated the addresses, generated by randomuser.me, into addresses
// that exist.

const fixDatabase = async function() {
  try {
    // Load all of the records in the database
    // Look at each record one by one. Is the address valid? 
    //
    // If it isn't, update the address to the closest existing postal code that we can find along with 
    // latitude and longitude values. 
    //
    // In the event that we can't find a postal code, manually delete those records from the database because
    // we won't be able to find a district.
    // 

    let allRecords = await VoterModel.find().exec();

    for(let i=0; i<allRecords.length; i++) {
      let data = allRecords[i];
      try {
        // console.log("Processing record ", data);
        let record = await convertToValidAddress(data, true);
        // console.log("Check that " + data.login.username + " has a postcode of " + record.location.postcode);
      } catch ( error ) {
        log.error("Error processing record ", record);
        log.error(error);
      }
    }
    return true; // update was successful

  } catch ( err ) {
    log.error("error when updating database to existing addresses ", err);
    return false;
  }
};


module.exports = {
  verifyUser : verifyUser,
  updateAddress : updateAddress,
  enterVote : enterVote,
  fixDatabase : fixDatabase
};


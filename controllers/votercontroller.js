const VoterModel = require('../models/Voter');
const axios = require("axios");
const addressController = require("./addressController");
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

    // Send back the user that was just found with its calculated district, latitude, and longitude
    log.trace("Tracing data transfer 1", data.location);
    data = await convertToValidAddress(data);
    log.trace("Tracing data transfer 2", data.location);
    let districtLocation = await findDistrictNameAndBoundaries(data.location.postcode);
    log.trace("Tracing data transfer 3", data.location);
    let dataClone = cloneData(data, districtLocation);
    log.trace("Tracing data transfer 4", data.location);

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
    const filter = { "login.username": username };
    const update = {
      "location.street.number": streetNo,
      "location.street.name": streetName,
      "location.city": city,
      "location.state": province,
      "location.postcode": postcode
    };

    data = await VoterModel.findOneAndUpdate(filter, update).exec();

    // Now that we've updated the record, retrieve it so that we can return it to the UI.
    data = await VoterModel.findOne(filter).exec();

    // Now copy over the district name, boundaries, etc.
    let districtLocation = await findDistrictNameAndBoundaries(data.location.postcode);
    log.trace("UpdateAddress tracing data transfer 1", data.location);
    let dataClone = cloneData(data, districtLocation);
    log.debug("UpdateAddress tracing data transfer 2", dataClone);

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
async function convertToValidAddress(data) {
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

    if(address.wasInvalid) {
      // Update the database to have the correct postal code, city and province, or the House of Commons.
      // Should the user click "Edit District", they should see the postal code that we are working off of.
      log.trace(`Debugging again. getValidAddress. Before internalUpdate ${username}, `, address);
      let data = await internalUpdateAddress(
        username,
        address
      );
      log.trace(`Debugging again. getValidAddress. After internalUpdate ${username}, `);
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

    // There seems to be a waiting period between the update call above and when the data is actually updated.
    // Manually update the data now so that everything works as it should.
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
    "location.postcode": location.postcode
  };

  let data = await VoterModel.findOneAndUpdate(filter, update).exec();
  return data;
}

// Copy the district name and boundaries (new fields) to the data
function cloneData(data, districtLocation) {
  log.debug("cloneData, districtLocation is ", districtLocation);
  log.debug("cloneData, data is ", data);

  // Cloning the data in the line below creates a _doc which contains the data.
  // Work around this by re-assigning the dataClone to the data that we want.
  let dataClone = { ...data };
  dataClone = dataClone._doc;

  log.debug("cloneData, dataClone is ", dataClone);
  log.debug("cloneData, dataClone.location is ", dataClone.location);
  dataClone.location.district = districtLocation.district;
  dataClone.location.districtBoundaries = districtLocation.districtBoundaries;
  log.debug("cloneData, districtBoundaries are ", dataClone.location.districtBoundaries);
  log.debug("cloneData, latitude is ", dataClone.location.coordinates.latitude);
  log.debug("cloneData, longitude is ", dataClone.location.coordinates.longitude);
  return dataClone;
}

// Given a retrieved user from the database, calculate the following:
//    1. Based on their address, which district they vote in.
//    2. The boundaries (polygon) of that district.
// 
// It is required that the data be sanitized before this method is called. i.e., convertToValidLocation is called
// and its result is passed into this method. Otherwise a 404 will be thrown.
//
async function findDistrictNameAndBoundaries(postcode) {
  let location = {
    district: "",
    districtBoundaries: ""
  }
  try {
    postcode = postcode.replace(/\s/g, ""); 

    // Now that we have a valid postal code, ask opennorth what district it belongs in.
    const districtURL = `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`;
    let districtData = await axios.get(districtURL);

    // And from that we get the district name.
    location.district = districtData.data.representatives_centroid[0].district_name;
    location.districtBoundaries = await getDistrictBoundaries(districtData.data);

    return location;
  } catch (err) {
    log.error("Error when findDistrictNameAndBoundaries ", err);

     // Most of the randomuser.me data is invalid. (e.g. a city that is in the wrong province, or a postal code that
     // doesn't exist, or latitude and longitude that don't exist.) When we retrieve one of the invalid records, we need to fail gracefully.
     // In case the address does not exist, take the street number and street name and "Canada" and see
     // if that exists. If it doesn't then fall back on a known Ottawa address, the House of Commons.
     // 
     // By specifying a valid address, the user can log in and update their address to something that exists.
     //
     // The below code is a last-ditch attempt after a user has been retrieved from the database but
     // we can't figure out where they are. The data is just too jumbled to figure out. Declare that the
     // voter lives in the House of Commons in Ottawa and continue so that the user can edit their address
     // online. 
     // 
     // We should never get to this catch block because the code above should have already defaulted to the
     // House of Commons in Ottawa but just in case...
     return {...defaultLocation };
  }
}

// This method takes the data returned by the call to opennorth's search on a postal code.
async function getDistrictBoundaries(districtData) {
  // Given the postal code, find the district.
  // From the district data you can find the URL to look up the boundaries for that district
  log.debug("districtData is ", districtData);
  const boundaryURL = districtData.boundaries_centroid[0].url;
  let boundaryURLQuery = `https://represent.opennorth.ca${boundaryURL}`;
  let boundaryData = await axios.get(boundaryURLQuery);
  log.debug("boundaryURLQuery is ", boundaryURLQuery);
  log.debug("boundaryData is ", boundaryData.data);

  // It will look something like the following:
  // {
  //   "metadata": {
  //     "FEDENAME": "Ottawa Centre",
  //     "PRNAME": "Ontario",
  //     "PRUID": "35",
  //     "FEDFNAME": "Ottawa-Centre",
  //     "FEDNAME": "Ottawa Centre / Ottawa-Centre",
  //     "FEDUID": "35075"
  //   },
  //   "extent": [
  //     -75.77875423737555,
  //     45.35268319415773,
  //     -75.66348945314755,
  //     45.429754307191835
  //   ],
  //   "external_id": "35075",
  //   "name": "Ottawa Centre",
  //   "boundary_set_name": "Federal electoral district",
  //   "centroid": {
  //     "coordinates": [
  //       -75.71901236571802,
  //       45.39511717193907
  //     ],
  //   "type": "Point"
  //   },
  //   "end_date": null,
  //   "related": {
  //     "shape_url": "/boundaries/federal-electoral-districts/35075/shape",
  //     "representatives_url": "/boundaries/federal-electoral-districts/35075/representatives/",
  //     "boundary_set_url": "/boundary-sets/federal-electoral-districts/",
  //     "boundaries_url": "/boundaries/federal-electoral-districts/",
  //     "centroid_url": "/boundaries/federal-electoral-districts/35075/centroid",
  //     "simple_shape_url": "/boundaries/federal-electoral-districts/35075/simple_shape"
  //   },
  //   "start_date": null
  // }

  // Then you get the shape_url
  let shapeURL = boundaryData.data.related.shape_url;
  let shapeURLQuery = `https://represent.opennorth.ca${shapeURL}`;
  let districtBoundary = await axios.get(shapeURLQuery);
  log.debug("shapeURL is ", shapeURL);
  log.debug("shapeURLQuery is ", shapeURLQuery);
  log.debug("districtBoundary is ", districtBoundary.data);


  // districtBoundary will look something like the following. (See k1a0a6_districtBoundaries.json for the full list.)
  /*
  {
    "coordinates": [
      [
        [
          [
          -75.68056163858387,
          45.41809970468586
          ], 
          // ... 552 of these points
        ]
      ]
    ],
    "type": "MultiPolygon"
  }
  */

  return districtBoundary.data;
}

module.exports = {
  verifyUser : verifyUser,
  updateAddress : updateAddress,
  enterVote : enterVote
};


const VoterModel = require('../models/Voter');
const PartyModel = require('../models/Party');
const DistrictModel = require('../models/District');
const CandidateModel = require('../models/Candidates');
const ottawaCentreDistrictBoundaries = require('./ottawaCentreDistrictBoundaries');
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
let TOKEN = process.env.MAPBOX_API_TOKEN; // Defined in Heroku via the CLI heroku config:set MAPBOX_API_TOKEN=foo
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

if(process.env.DEVELOPMENT_MAPBOX_APIKEY) {
  // running locally. Switch to the local mapbox API key and read what level of logging we want.
  // Available levels are the following: 'trace', 'debug', 'info', 'warn', 'error'
  log.trace("votercontroller using development API key");
  TOKEN = process.env.DEVELOPMENT_MAPBOX_APIKEY;
} 
const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
const otherParms = `&access_token=${TOKEN}&cachebuster=1571367145365&autocomplete=true`;
log.trace("votercontroller otherParms is ", otherParms);

const houseOfCommonsLocation = {
  streetNo: 1,
  streetName: "Wellington Street",
  city: "Ottawa",
  province: "Ontario",
  postcode: "K1A 0A6",
  latitude: 45.424020,
  longitude: -75.696920,
  district: "Ottawa Centre",
  districtBoundaries: ottawaCentreDistrictBoundaries,
  districtURL: "Using default location: House of Commons in Ottawa",
  latLongURL: "Using default location: House of Commons in Ottawa",
  data: null
}
let defaultLocation = houseOfCommonsLocation;

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

const internalUpdateAddress = async function(username, location) {
  const filter = { "login.username": username };
  const update = {
    "location.street.number": location.streetNo,
    "location.street.name": location.streetName,
    "location.city": location.city,
    "location.state": location.province,
    "location.postcode": location.postcode
  };

  let data = await VoterModel.findOneAndUpdate(filter, update).exec();
  return data;
}

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

    // Don't need to copy over the district name or boundaries here because 
    // this method is called only after the user's address has already been verified.
    // When the address is verified on login it is corrected if necessary.
    return data; 
  } catch ( error ) {
    log.error("error when update address", error);
    log.error("update address data retrieved was ", data);
    return false;
  }
};

// If the location has a postal code, return it. Otherwise return null.
function getPostalCode(address) {
  // Convert to uppercase and remove the spaces to make the regex simpler
  const reduce = address.toUpperCase().replace(/\s/g, "");
  let result = (reduce.match(/([A-Z]\d){3}/));
  if(result === null) {
    return null;
  } else {
    return result[0]; // The first test always returns two matches: L2N4X9 and X9. Why????
  }
}

// 
// Did the user enter a valid address in the Edit District page?
// Does this record from the database contain valid information?
//
async function getValidAddress(streetNo, streetName, city, province, postcode, updateDatabaseIfInvalid, username="") {
  // This method needs to protect against every type of invalid input possible. If it can go wrong, it will. 
  let address = {
    streetNo: streetNo,
    streetName: streetName,
    city: city,
    province: province,
    postcode: postcode.replace(/\s/g, ""),
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude
  };
  log.trace("getValidAddress, address is 1 ", address);

  try {
    let response = null;
    if(address.postcode !== null && address.postcode !== "") {
      address.postcode = address.postcode.replace(/\s/g, ""); 
      const postcodeSearch = address.postcode + ".json?types=postcode";
      let latLongURL = `${URLstart}${postcodeSearch}${otherParms}`;
      response = await axios.get(latLongURL);
    }
    log.trace("getValidAddress, address is 2 ", address);

    if(response.data.features.length !== 0) {
      // Great, that's all that we need to generate an election district. 
      // Is the rest of the address valid?
      // Format: A0A 0A0, Toronto, Ontario, Canada

      const placeName = response.data.features[0].place_name;
      const cityStartIndex = placeName.indexOf(",");
      const provinceStartIndex = placeName.indexOf(",", cityStartIndex+1);
      const provinceEndIndex = placeName.indexOf(",", provinceStartIndex+1);
      const postcode = placeName.substring(0,7).trim().replace(/\s/g, "");
      const city = placeName.substring(cityStartIndex+1,provinceStartIndex).trim();
      const province = placeName.substring(provinceStartIndex+1,provinceEndIndex).trim();
    
      log.debug("Look for latitude and longitude in response.data ", response.data);
      log.debug("center is ", response.data.features[0].center);
      log.debug("responseLocation city equal address city? ", (city === address.city));
      log.debug("responseLocation province equal address province? ", (province === address.province));
      log.debug("responseLocation postcode equal address postcode? ", (postcode.replace(/\s/g, "") === address.postcode.replace(/\s/g, "")));

      // Postal code can be either form, both of which are equivalent: A0A 0A0 or A0A0A0
      if( (city === address.city) && 
          (province === address.province) && 
          (postcode === address.postcode)) {
        // The rest of the address is valid
        address.latitude = response.data.features[0].center[1];
        address.longitude = response.data.features[0].center[0];
        log.trace("getValidAddress, address is 3 ", address);
        return address;
      }
    } 

   // mapbox couldn't find the postal code. Search via the address and "Canada" instead.
    const eAddress = encodeURI(streetNo + " " + streetName);
    let latLongURL = `${URLstart}${eAddress}.json?country=CA${otherParms}`;
    response = await axios.get(latLongURL);

    if(response.data.features.length === 0) {
      // Still can't find it? No such address in Canada? 
      // Shouldn't happen but just in case, resort to default addres (House of Commons in Ottawa).
      address.city = defaultLocation.city;
      address.province = defaultLocation.province;
      address.postcode = defaultLocation.postcode;
      address.latitude = defaultLocation.latitude;
      address.longitude = defaultLocation.longitude;
      log.trace("getValidAddress, address is 4 ", address);
    } else {
      // We found an address in Canada. To find the postal code we need to parse it out of the feature's place_name.
      // Format looks something like this: "place_name": "695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada"
      // Sometimes the format looks like this: "place_name": 'Wayerton, New Brunswick, Canada',
      const place_name = response.data.features[0].place_name;
      const lastCommaIndex = place_name.lastIndexOf(",");
      const provinceStartCommaIndex = place_name.lastIndexOf(",", lastCommaIndex-1);
      const cityStartCommaIndex = place_name.lastIndexOf(",", provinceStartCommaIndex-1);
      address.postcode = getPostalCode(place_name);
      if(address.postcode !== null) {
        // 695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
        // We know that the postal code is right before the country, so subtract 7 characters and extract
        // just those 7.
        // We know that postcode exists in Canada because mapbox returns only valid addresses.
    
        // Extract the correct city name (everything after the first comma and before the second comma)
        address.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
    
        // Extract the correct province (everything after the second comma and before the postal code)
        const canadaIndex = place_name.indexOf(", Canada");
        address.province = place_name.substring(provinceStartCommaIndex+1, canadaIndex-7).trim();
        address.latitude = response.data.features[0].center[1];
        address.longitude = response.data.features[0].center[0];
        log.debug("Debug getValidAddress, place_name is " + place_name);
        log.trace("provinceStartCommaIndex+1 is " + (provinceStartCommaIndex+1) + " and canadaIndex-7 is " + (canadaIndex-7));
        log.debug("Debug getValidAddress, address is 5 ", address);
     } else {
        // There's no postal code or street address. 
        // e.g. Wayerton, New Brunswick, Canada
        //      9316 Main Street North, Murray River, Prince Edward Island, Canada
        // While we could get an API key with Canada Post, for now we will use the default 
        // postal code (Canada's House of Commons) with the mapbox city and province in the address.
        // 
        let firstCommaIndex = place_name.lastIndexOf(cityStartCommaIndex-1);
        if(firstCommaIndex < 0) {
          address.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
        } else {
          address.city = place_name.substring(firstCommaIndex+1, cityStartCommaIndex).trim();
        }
        address.province = place_name.substring(provinceStartCommaIndex+1, lastCommaIndex).trim();
        address.postcode = defaultLocation.postcode;
        log.debug("response data for no postal code is ", response.data);
        address.latitude = defaultLocation.latitude;
        address.longitude = defaultLocation.longitude;
        log.trace("getValidAddress, address is 6 ", address);
      }
    }

    log.trace("Debug getValidAddress, output before calling update on database (if applicable) is ", address);

    if(updateDatabaseIfInvalid) {
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
    return address;
  } catch ( error ) {
    log.error("Error when checking if address is valid ", error);
  }
}

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
    // Start by checking with mapbox if the postal code exists. If it does, great. If the address
    // matches then even better. Usually the postal code doesn't exist, and thus you need to update the
    // user's data. 
    // 

    // Do not send the postal code to opennorth until we know that it's a valid one. If a postal code that doesn't
    // exist is sent to opennorth, a 404 is returned and the user can't log in. This method will 
    // sanitize the input for the application so that we can continue. 
    // 

    let address = await getValidAddress(
      data.location.street.number,
      data.location.street.name,
      data.location.city,
      data.location.state,
      data.location.postcode, 
      true, // update the address in the database if it was invalid
      data.login.username // for updating the database
    );

    
    // There seems to be a waiting period between the update call above and when the data is actually updated.
    // Manually update the data now so that everything works as it should.
    data.location.streetNo = address.streetNo;
    data.location.streetName = address.streetName;
    data.location.city = address.city;
    data.location.state = address.province;
    data.location.postcode = address.postcode;
    data.location.coordinates.latitude = address.latitude;
    data.location.coordinates.longitude = address.longitude;

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
    data.location.streetNo = defaultLocation.streetNo;
    data.location.streetName = defaultLocation.streetName;
    data.location.city = defaultLocation.city;
    data.location.state = defaultLocation.province;
    data.location.postcode = defaultLocation.postcode;
    data.location.latitude = defaultLocation.latitude;
    data.location.longitude = defaultLocation.longitude;

  }
  return data;
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
    log.debug("location.districtBoundaries is ", location.districtBoundaries);
    log.trace("findDistrictNameAndBoundaries, district location is ", location);

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

// Copy the district name and boundaries (new fields) to the data
function cloneData(data, districtLocation) {
  log.trace("cloneData, districtLocation is ", districtLocation);
  let dataClone = { ...data };
  dataClone._doc.location.district = districtLocation.district;
  dataClone._doc.location.districtBoundaries = districtLocation.districtBoundaries;
  log.debug("cloneData, latitude is ", dataClone._doc.location.coordinates.latitude);
  log.debug("cloneData, longitude is ", dataClone._doc.location.coordinates.longitude);
  // dataClone._doc.location.coordinates.latitude = location.latitude;
  // dataClone._doc.location.coordinates.longitude = location.longitude;
  return dataClone;
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



// We won't create a new voter
// exports.createNewVoter = async function(voterInfo) {
//   let newVoter = new VoterModel(voterInfo);
//   let result = await newVoter.save();

//   res.send(result);
// };

// User can't update their vote. Once it's cast then that's it. 
// exports.updateVote = async function(req, res) {
//   let result = await VoterModel.findOneAndUpdate(
//     { uuid: req.params.uuid },
//     {
//       $set: {
//         "name.title": req.body.title,
//         "name.first": req.body.first_name,
//         "name.last": req.body.last_name,
//         "name.gender": req.body.gender,
//         "location.street.number": req.body.street_no,
//         "name.location.street.": req.body.street_name,
//         "location.city": req.body.city,
//         "location.state": req.body.province,
//         "location.postcode": req.body.postalcode,
//         "location.country": req.body.country
//       }
//     }
//   );
//   res.send(result);
// };

const enterVote = async function(voter, candidateid) {
  let newVoteTally = await CandidateModel.findOneAndUpdate(
    { _id: candidateid },
    { $inc: { votes_for: 1 } }
  );

  let voteCast = await VoterModel.findOneAndUpdate(
    { _id: voterid },
    { $set: { hasvoted: true } }
  );
  res.send(newVoteTally);
};

const findCandidates = async function(postcode) {
  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
  );
  let candidateList = await CandidateModel.find({
    district_name: data.data.representatives_centroid[0].district_name
  });
  // console.log("Candidate list is ", candidateList);
  //   for (i = 0; i < candidateList.length; i++) {
  //     let apiData = await axios.get(
  //       `https://represent.opennorth.ca/candidates/?last_name=${candidateList[i].last_name}&first_name=${candidateList[i].first_name}&format=json`
  //     );
  //      console.log("Source is ", apiData.data.objects);
  //      console.log("The Data is ", apiData);
  //      districtCandidates.push(apiData.offices);
  //   }
  //      console.log("New candidate list is ", districtCandidates);
  return candidateList;
};

const runSimulation = async function() {
  for await (const voterList of VoterModel.findOne()) {
    let postcode = voterList.location.postcode.replace(/\s/g, "");
    await setInterval(async function() {
      //   await console.log(
      //     `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
      //   );
      let district = await axios.get(
        `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
      );
      await console.log(
        "District is ",
        district.data.representatives_centroid[0].district_name
      );

      //   let candidateList = await db.candidate.find({
      //     district_name: district.data.representatives_centroid[0].district_name
      //   });
      //   console.log("Candidate list is ", candidateList);

      //   if (candidateList.length > 0) {
      //     let newVoteTally = await db.candidate.findOneAndUpdate(
      //       {
      //         _id:
      //           candidateList[Math.floor(Math.random() * candidateList.length)]
      //             ._id
      //       },
      //       { $inc: { votes_for: 1 } }
      //     );

      //     let voteCast = await db.voter.findOneAndUpdate(
      //       { _id: voterList._id },
      //       { $set: { hasvoted: true } }
      //     );
      // Math.floor(Math.random() * candidateList.length);
      //   }
      console.log(voterList.name);
    }, 60000);
  }
};

module.exports = {
  verifyUser : verifyUser,
  updateAddress : updateAddress,
  enterVote : enterVote,
  findCandidates : findCandidates,
  runSimulation : runSimulation,
  getValidAddress : getValidAddress
};


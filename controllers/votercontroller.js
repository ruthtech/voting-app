const VoterModel = require('../models/Voter');
const PartyModel = require('../models/Party');
const DistrictModel = require('../models/District');
const CandidateModel = require('../models/Candidates');

const axios = require("axios");
const TOKEN = "pk.eyJ1IjoiZXNjaGVyZmFuIiwiYSI6ImNrMXdid2lyNTAwNmkzbW93bTNpMHE4N3YifQ.7Jg5xKMsj7Y29BJG74q7Aw";
const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
const otherParms = `&access_token=${TOKEN}&cachebuster=1571367145365&autocomplete=true`;

const houseOfCommonsLocation = {
  streetNo: 1,
  streetName: "Wellington Street",
  city: "Ottawa",
  province: "Ontario",
  postcode: "K1A 0A6",
  latitude: 45.42521,
  longitude: -75.70011,
  district: "Ottawa Centre",
  districtURL: "Using default location: House of Commons in Ottawa",
  latLongURL: "Using default location: House of Commons in Ottawa",
  data: null
}
let defaultLocation = houseOfCommonsLocation;

const verifyUser = async function(username, password) {
  let data = null;
  let location = null;
  try {
    data = await VoterModel.findOne({
      "login.username": username,
      "login.password": password
    }).exec();

    if (!data) {
      console.log(`No user found for username ${username} with that password.`);
      return false;
    }

    // Send back the user that was just found with its calculated district, latitude, and longitude
    console.log("DEBUG for Heroku. Losing location data in transfer somewhere. But where? 1", data.location);
    data = await convertToValidLocation(data);
    console.log("DEBUG for Heroku. Losing location data in transfer somewhere. But where? 2", data.location);
    location = await loadDistrictAndLocation(data);
    console.log("DEBUG for Heroku. Losing location data in transfer somewhere. But where? 3", data.location);
    let dataClone = cloneData(data, location);
    console.log("DEBUG for Heroku. Losing location data in transfer somewhere. But where? 4", dataClone);

    return dataClone;
  } catch ( err ) {
    console.log("error when find/verify user ");
    console.log("data retrieved was ", data);
    console.log("location data was ", location);
    console.log(err);
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
  let location = null;
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

    // Unfortunately the randomuser.me data doesn't know the district name, nor does its
    // random latitude and longitude exist. However, given a valid address, we can
    // calculate these. 
    location = await loadDistrictAndLocation(data);

    // Send back the user that was just updated with its new district, latitude, and longitude
    let dataClone = cloneData(data, location);
    return dataClone;
  } catch ( error ) {
    console.log("error when update address");
    console.log("data retrieved was ", data);
    console.log("location data was ", location);

    console.log(error);
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

// Format: A0A 0A0, Toronto, Ontario, Canada
function getLocation(address) {
  let location = {
    city: "",
    province: "",
    postcode: ""
  };

  const cityStartIndex = address.indexOf(",");
  const provinceStartIndex = address.indexOf(",", cityStartIndex+1);
  const provinceEndIndex = address.indexOf(",", provinceStartIndex+1);
  location.postcode = address.substring(0,7).trim();
  location.city = address.substring(cityStartIndex+1,provinceStartIndex).trim();
  location.province = address.substring(provinceStartIndex+1,provinceEndIndex).trim();
  return location;
}

// 
// Did the user enter a valid address in the Edit District page?
// Does this record from the database contain valid information?
//
async function getValidAddress(streetNo, streetName, city, province, postcode) {
  // This method needs to protect against every type of invalid input possible. If it can go wrong, it will. 
  let location = {
    streetNo: streetNo,
    streetName: streetName,
    city: city,
    province: province,
    postcode: postcode
  };

  try {
    let response = null;
    if(location.postcode !== null && location.postcode !== "") {
      location.postcode = location.postcode.replace(/\s/g, ""); 
      const postcodeSearch = location.postcode + ".json?types=postcode";
      let latLongURL = `${URLstart}${postcodeSearch}${otherParms}`;
      response = await axios.get(latLongURL);
    }

    if(response.data.features.length !== 0) {
      // Great, that's all that we need to generate an election district. 
      // Is the rest of the location valid?
      // Format: A0A 0A0, Toronto, Ontario, Canada
      let responseLocation = getLocation(response.data.features[0].place_name);

      if( (responseLocation.city === location.city) && 
          (responseLocation.province === location.province) && 
          (responseLocation.postcode === location.postcode)) {
        // The rest of the location is valid
        return location;
      }
    } 

   // mapbox couldn't find the postal code. Search via the address and "Canada" instead.
    const eAddress = encodeURI(streetNo + " " + streetName);
    let latLongURL = `${URLstart}${eAddress}.json?country=CA${otherParms}`;
    response = await axios.get(latLongURL);

    if(response.data.features.length === 0) {
      // Still can't find it? No such address in Canada? 
      // Shouldn't happen but just in case, resort to default location (House of Commons in Ottawa).
      location.city = defaultLocation.city;
      location.province = defaultLocation.province;
      location.postcode = defaultLocation.postcode;
    } else {
      // We found an address in Canada. To find the postal code we need to parse it out of the feature's place_name.
      // Format looks something like this: "place_name": "695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada"
      // Sometimes the format looks like this: "place_name": 'Wayerton, New Brunswick, Canada',
      const place_name = response.data.features[0].place_name;
      const lastCommaIndex = place_name.lastIndexOf(",");
      const provinceStartCommaIndex = place_name.lastIndexOf(",", lastCommaIndex-1);
      const cityStartCommaIndex = place_name.lastIndexOf(",", provinceStartCommaIndex-1);
      location.postcode = getPostalCode(place_name);
      if(location.postcode !== null) {
        // 695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
        // We know that the postal code is right before the country, so subtract 7 characters and extract
        // just those 7.
        // We know that postcode exists in Canada because mapbox returns only valid addresses.
    
        // Extract the correct city name (everything after the first comma and before the second comma)
        location.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
    
        // Extract the correct province (everything after the second comma and before the postal code)
        const canadaIndex = place_name.indexOf(", Canada");
        location.province = place_name.substring(provinceStartCommaIndex+1, canadaIndex-7).trim();
     } else {
        // There's no postal code or street address. 
        // e.g. Wayerton, New Brunswick, Canada
        //      9316 Main Street North, Murray River, Prince Edward Island, Canada
        // While we could get an API key with Canada Post, for now we will use the default 
        // postal code (Canada's House of Commons) with the mapbox city and province in the address.
        // 
        let firstCommaIndex = place_name.lastIndexOf(cityStartCommaIndex-1);
        if(firstCommaIndex < 0) {
          location.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
        } else {
          location.city = place_name.substring(firstCommaIndex+1, cityStartCommaIndex).trim();
        }
        location.province = place_name.substring(provinceStartCommaIndex+1, lastCommaIndex).trim();
        location.postcode = defaultLocation.postcode;
      }
    }
    return location;
  } catch ( error ) {
    console.log("getValidAddress9");
    console.log(error);
  }
}

// randomuser.me generates nonsense for many fields. Each field makes sense in isolation but together they don't exist,
// e.g. a city from one province listed in another province, with a postal code that doesn't exist, 
// latitude and longitude that don't exist, and a timezone in Jakarta. (That's a real example.)
// 
// This method looks at the data to see if it's been converted to a valid location already and if so just returns it.
// If it isn't valid, it does what it needs to to make it valid and then returns it.
async function convertToValidLocation(data) {
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

    let location = await getValidAddress(
      data.location.street.number,
      data.location.street.name,
      data.location.city,
      data.location.state,
      data.location.postcode
    );

    // Update the database to have the correct postal code, city and province, or the House of Commons.
    // Should the user click "Edit District", they should see the postal code that we are working off of.
    // console.log(`Debugging again. ${data.login.username}, ${location}`);
    data = await internalUpdateAddress(
      data.login.username,
      location
    );

    // There seems to be a waiting period between the update call above and when the data is actually updated.
    // Manually update the data now so that everything works as it should.
    data.location.city = location.city;
    data.location.state = location.province;
    data.location.postcode = location.postcode;

  } catch ( err ) {
    // If all else fails, update data to the default location
    console.log(err);

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
  }
  return data;
}


// Given a retrieved user from the database, calculate the following:
//    1. Based on their address, which district they vote in.
//    2. The latitude and longitude of their address. (Random.me generates nonsense for those fields, just like the postal code is nonsense.)
// 
// It is required that the data be sanitized before this method is called. i.e., convertToValidLocation is called
// and its result is passed into this method. Otherwise a 404 will be thrown.
//
async function loadDistrictAndLocation(data) {
  let location = {
    district: "",
    districtURL: "", // for debugging
    districtData: null, // for debugging
    latitude: 0,
    longitude: 0,
    latLongURL: "" // for debugging
  }
  try {
   // First find the postal code.
   const eCity = encodeURI(data.location.city);
   const eProvince = encodeURI(data.location.state);
   const postcode = data.location.postcode.replace(/\s/g, ""); 
   const eAddress = encodeURI(data.location.street.number + " " + data.location.street.name);

   // Now that we have a valid postal code, ask opennorth what district it belongs in.
   location.districtURL = `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`;
   location.districtData = await axios.get(location.districtURL);

   // And from that we get the district name.
   location.district = location.districtData.data.representatives_centroid[0].district_name;

   // Now to find the latitude and longitude
   // Address may contain characters that need to be converted for the URL
   // Address may not exist
   const cityProvinceCountry = `.json?place=${eCity}&region=${eProvince}&country=CA`;
   location.latLongURL = `${URLstart}${eAddress}${cityProvinceCountry}${otherParms}`;
 
   response = await axios.get(location.latLongURL);

   location.longitude = response.data.features[0].geometry.coordinates[0];
   location.latitude = response.data.features[0].geometry.coordinates[1];
   return location;

  } catch (err) {
    console.log("loadDistrictAndLocation ", location);
    console.log(err);
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
     location = defaultLocation;

     return location;
  }
}

function cloneData(data, location) {
  let dataClone = { ...data };
  dataClone._doc.location.district = location.district;
  dataClone._doc.location.coordinates.latitude = location.latitude;
  dataClone._doc.location.coordinates.longitude = location.longitude;
  return dataClone;
}

// This method takes the data returned by the call to opennorth's search on a postal code.
function findDistrictBoundariesURL(districtData) {
  // Given the postal code, find the district.
  // From the district data you can find the URL to look up the boundaries for that district
  const boundaryURL = districtData.foundaries_centroid[0].url;
  let boundaryURLQuery = `https://represent.opennorth.ca${boundaryURL}`;
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
  let shapeURL = boundaryURLQuery.related.shape_url;
  let shapeURLQuery = `https://represent.opennorth.ca${shapeURL}`;

  // That will produce something like the following
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


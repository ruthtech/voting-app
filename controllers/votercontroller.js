const VoterModel = require('../models/Voter');
const PartyModel = require('../models/Party');
const DistrictModel = require('../models/District');
const CandidateModel = require('../models/Candidates');

axios = require("axios");

exports.verifyUser = async function(username, password) {
  let data = null;
  let location = null;
  try {
    data = await VoterModel.findOne({
      "login.username": username,
      "login.password": password
    }).exec();

    if (!data) {
      console.log("DEBUG no user found for username " + username);
      return false;
    }

    // Send back the user that was just found with its calculated district, latitude, and longitude
    location = await loadDistrictAndLocation(data);
    let dataClone = cloneData(data, location);

    return dataClone;
  } catch ( err ) {
    console.log("error when find/verify user ");
    console.log("data retrieved was ", data);
    console.log("location data was ", location);
    console.log(err);
    return false;
  }
};

exports.updateAddress = async function(username, streetNo, streetName, city, province, postalCode) {
  let data = null;
  let location = null;
  try {
    const filter = { "login.username": username };
    const update = {
      "location.street.number": streetNo,
      "location.street.name": streetName,
      "location.city": city,
      "location.state": province,
      "location.postcode": postalCode
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


// Given a retrieved user from the database, calculate the following:
//    1. Based on their address, which district they vote in.
//    2. The latitude and longitude of their address. (Random.me generates nonsense for those fields, just like the postal code is nonsense.)
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
   // First, find the postal code
   let postalcode = data.location.postcode.replace(/\s/g, ""); 
   location.districtURL = `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`;

   // Now we need to find out what district this postal code is in
   location.districtData = await axios.get(location.districtURL);

   // And from that we get the district name.
   location.district = location.districtData.data.representatives_centroid[0].district_name;

   // Now to find the latitude and longitude
   const eAddress = escape(data.location.street.number + " " + data.location.street.name);
   const eCity = escape(data.location.city);
   const eProvince = escape(data.location.state);

   // Address may contain characters that need to be converted for the URL
   // Address may not exist
   const TOKEN = "pk.eyJ1IjoiZXNjaGVyZmFuIiwiYSI6ImNrMXdid2lyNTAwNmkzbW93bTNpMHE4N3YifQ.7Jg5xKMsj7Y29BJG74q7Aw";
   const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
   const cityProvinceCountry = `.json?place=${eCity}&region=${eProvince}&country=CA`;
   const otherParms = `&access_token=${TOKEN}&cachebuster=1571367145365&autocomplete=true`;
 
   location.latLongURL = `${URLstart}${eAddress}${cityProvinceCountry}${otherParms}`;
 
   let response =  await axios.get(location.latLongURL);
   location.longitude = response.data.features[0].geometry.coordinates[0];
   location.latitude = response.data.features[0].geometry.coordinates[1];
   
   return location;
  } catch (err) {
    console.log("loadDistrictAndLocation ", location);
    console.log(err);
  }
}

function cloneData(data, location) {
  let dataClone = { ...data };
  dataClone._doc.location.district = location.district;
  dataClone._doc.location.coordinates.latitude = location.latitude;
  dataClone._doc.location.coordinates.longitude = location.longitude;
  return dataClone;
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

exports.enterVote = async function(voter, candidateid) {
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

exports.findCandidates = async function(postalcode) {
  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`
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

exports.runSimulation = async function() {
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



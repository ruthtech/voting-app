const mongoose = require("mongoose");
db = require("../models");
// Candidate = mongoose.model("Candidate");
axios = require("axios");

exports.verifyUser = async function(username, password) {
  let data = await db.Voter.findOne({
    "login.username": username,
    "login.password": password
  });
  if (!data) {
    return false;
  }
  return data;
};

exports.createNewVoter = async function(voterInfo) {
  let newVoter = new db.Voter(voterInfo);
  let result = await newVoter.save();

  res.send(result);
};

exports.updateVote = async function(req, res) {
  let result = await db.Voter.findOneAndUpdate(
    { uuid: req.params.uuid },
    {
      $set: {
        "name.title": req.body.title,
        "name.first": req.body.first_name,
        "name.last": req.body.last_name,
        "name.gender": req.body.gender,
        "location.street.number": req.body.street_no,
        "name.location.street.": req.body.street_name,
        "location.city": req.body.city,
        "location.state": req.body.province,
        "location.postcode": req.body.postalcode,
        "location.country": req.body.country
      }
    }
  );
  res.send(result);
};

exports.enterVote = async function(voter, candidateid) {
  let newVoteTally = await db.Candidate.findOneAndUpdate(
    { _id: candidateid },
    { $inc: { votes_for: 1 } }
  );

  let voteCast = await db.Voter.findOneAndUpdate(
    { _id: voterid },
    { $set: { hasvoted: true } }
  );
  res.send(newVoteTally);
};

exports.findCandidates = async function(postalcode) {
  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`
  );
  let candidateList = await db.Candidate.find({
    district_name: data.data.candidates_centroid[0].district_name
  });
  console.log("Candidate list is ", candidateList);
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
  for await (const voterList of db.Voter.findOne()) {
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
        district.data.candidates_centroid[0].district_name
      );

      //   let candidateList = await db.Candidate.find({
      //     district_name: district.data.candidates_centroid[0].district_name
      //   });
      //   console.log("Candidate list is ", candidateList);

      //   if (candidateList.length > 0) {
      //     let newVoteTally = await db.Candidate.findOneAndUpdate(
      //       {
      //         _id:
      //           candidateList[Math.floor(Math.random() * candidateList.length)]
      //             ._id
      //       },
      //       { $inc: { votes_for: 1 } }
      //     );

      //     let voteCast = await db.Voter.findOneAndUpdate(
      //       { _id: voterList._id },
      //       { $set: { hasvoted: true } }
      //     );
      // Math.floor(Math.random() * candidateList.length);
      //   }
      console.log(voterList.name);
    }, 60000);
  }
};

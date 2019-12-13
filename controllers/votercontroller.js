const mongoose = require("mongoose");
db = require("../models");
Candidate = mongoose.model("Candidate");
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
  let result = await db.voters.findOneAndUpdate(
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

exports.enterVote = async function(req, res) {
  let newVoteTally = await db.Candidate.findOneAndUpdate(
    { _id: req.params.candidateID },
    { $inc: { votes_for: 1 } }
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
  return candidateList;
};

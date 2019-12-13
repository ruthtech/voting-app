const mongoose = require("mongoose");
db = require("./models");
Candidate = mongoose.model("Candidate");

exports.verifyUser = async function(req, res) {
  if (
    (await db.Voter.findOne({
      login: { username: req.params.username, password: req.params.password }
    }).length) > 0
  ) {
    return true;
  }

  return false;
};

exports.createNewVoter = async function(req, res) {
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

exports.enterVote = async function(req, res) {
  let newVoteTally = await db.Candidate.findOneAndUpdate(
    { _id: req.params.candidateID },
    { $inc: { votes_for: 1 } }
  );
  res.send(newVoteTally);
};

exports.findCandidates = async function(req, res) {
  let voterPostalCode = await db.Voter.find(
    { uuid: req.params.uuid },
    { "location.postcode": 1 }
  );

  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${voterPostalCode}/?sets=federal-electoral-districts&format=json`
  );

  let candidateList = await db.Candidate.find({
    district_name: data.candidates_centroid[0].district_name
  });
  res.send(candidateList);
};

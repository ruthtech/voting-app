const mongoose = require("mongoose");
Voter = mongoose.model("Voter");
Candidate = mongoose.model("Candidate");

exports.verifyUser = async function(req, res) {
  if (
    (await Voter.findOne({
      login: { username: req.params.username, password: req.params.password }
    }).length) > 0
  ) {
    return true;
  }

  return false;
};

exports.createNewVoter = async function(req, res) {
  let newVoter = new Voter(voterInfo);
  let result = await newVoter.save();

  return result;
};

exports.updateVote = async function(req, res) {
  let newVoteTally = await Voter.findOneAndUpdate(
    { uuid: candidateID },
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
};

exports.enterVote = async function(req, res) {
  let newVoteTally = await Candidate.findOneAndUpdate(
    { _id: candidateID },
    { $inc: { votes_for: 1 } }
  );
};

exports.findCandidates = async function(req, res) {
  let voterPostalCode = await Voter.find(
    { uuid: req.params.uuid },
    { "location.postcode": 1 }
  );

  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${voterPostalCode}/?sets=federal-electoral-districts&format=json`
  );

  let candidateList = await Candidate.find({
    district_name: data.candidates_centroid[0].district_name
  });
  res.send(candidateList);
};

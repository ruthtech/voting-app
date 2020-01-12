const CandidateModel = require('../models/Candidates');
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

const enterVote = async function(candidateid) {
  log.trace("candidatecontroller entering a vote ");
  log.trace(`enterVote candidateid: ${candidateid})`);

  let newVoteTally = await CandidateModel.findOneAndUpdate(
    { _id: candidateid.toString() },
    { $inc: { 'votes_for': 1 } }
  );

  return newVoteTally;
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
  log.debug("candidatecontroller list of candidates is ", candidateList);
  return candidateList;
};

module.exports = {
  enterVote : enterVote,
  findCandidates : findCandidates
};


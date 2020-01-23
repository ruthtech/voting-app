const CandidateModel = require('../models/Candidates');
const addressController = require('./addressController');
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

let TOKEN = process.env.MAPBOX_API_TOKEN; // Defined in Heroku via the CLI heroku config:set MAPBOX_API_TOKEN=foo
if(process.env.DEVELOPMENT_MAPBOX_APIKEY) {
  // running locally. Switch to the local mapbox API key and read what level of logging we want.
  // Available levels are the following: 'trace', 'debug', 'info', 'warn', 'error'
  log.trace("candidateController using development API key");
  TOKEN = process.env.DEVELOPMENT_MAPBOX_APIKEY;
} 

const majorPartiesQuebec = [
  'Independent',
  'Conservative Party of Canada',
  'Green Party of Canada',
  'Liberal Party of Canada',
  'New Democratic Party',
  'Bloc Québécois'
];

const majorParties = [
  'Independent',
  'Conservative Party of Canada',
  'Green Party of Canada',
  'Liberal Party of Canada',
  'New Democratic Party'
];

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
  try {
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
  } catch ( error ) {
    console.log("Error while retrieving candidates for postcode ", postcode);
    console.log(error);
    return [];
  }
};

// Given a latitude and a longitude of a district, find the candidates who were running in 
// that district and which parties they represented. Return the list of parties as an array of
// strings, with each candidate's party (or Independent) as one entry in the array.
// e.g. ['Liberal', 'Conservaties', 'NDP', 'Green', 'Bloc Quebecois']
const getParties = async function(latitude, longitude) {
  // Unfortunately opennorth only has elected officials for the latitude/longitude, so 
  // we need mapbox to translate this point into a postal code and then send that postal code
  // to opennorth. opennorth can look up candidates by postal code.

  const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
  const otherParms = `?access_token=${TOKEN}`;
  let point = `${longitude},${latitude}`
  let addressURL = `${URLstart}${point}.json${otherParms}`;
  log.debug(addressURL);
  response = await axios.get(addressURL);
  log.debug("candidateController getParties response length is ", response.data.features.length);
  log.debug(response.data.features);
  const isQuebec = (response.data.features[0].place_name.indexOf('Quebec') >= 0);
  let postcode = addressController.getPostalCode(response.data.features[0].place_name);
  if(postcode === null) {
    // No postal code means we can't look up the candidates, which means no parties
    // Default to the major five
    log.info("no postal code; returning major parties for " + response.data.features[0].place_name + " isQuebec? " + isQuebec);
    if(isQuebec) return majorPartiesQuebec;
    return majorParties;
  }

  // Unfortunately opennorth doesn't seem to have a way to narrow down to just the federal
  // election results for candidates. Populate the District database in the model with some.
  // Because the district database isn't fully populated, sometimes the call below will not
  // return a list of candidates
  let candidateList = await findCandidates(postcode);
  if(candidateList.length === 0) {
    log.info("no candidates; returning major parties for ", postcode);
    if(isQuebec) return majorPartiesQuebec;
    return majorParties;
  }

  let candidateParties = [];
  for(let i=0; i<candidateList.length; i++) {
    candidateParties.push(candidateList[i].party_affiliation);
  }
  return candidateParties;
}

module.exports = {
  enterVote : enterVote,
  findCandidates : findCandidates,
  getParties : getParties
};


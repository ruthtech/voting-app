const DistrictModel = require('../models/District');
const mongoose = require("../models/mongoose_connection");
const candidateController = require('./candidateController');
const log = require('loglevel');
require('dotenv').config();

const axios = require("axios");
if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

// Who 'won' the seat in the election?
async function enterPartySeat(district, partyName) {
  await DistrictModel.findOneAndUpdate(
    { _id: district._id },
    { $set: { 'seat': partyName } }
  );
}

// Set all seats in the database back to the default (null)
async function resetPartySeats() {
  await DistrictModel.updateMany(
    {}, // No filter means update every document in the collection
    { $set: { 'seat': null } }
  );
}

async function initializeDistricts() {
  // https://represent.opennorth.ca/boundaries/federal-electoral-districts/
  let numberRecordsInserted = 0;
  let hasNext = true;
  let boundariesURLQuery = `https://represent.opennorth.ca/boundaries/federal-electoral-districts/`;
  while(hasNext) {
    let boundaryData = await axios.get(boundariesURLQuery);

    // Information about the first twenty boundary sets
    // "objects": [
    //   {
    //   "boundary_set_name": "Federal electoral district",
    //   "external_id": "62001",
    //   "name": "Nunavut",
    //   "related": {
    //   "boundary_set_url": "/boundary-sets/federal-electoral-districts/"
    //   },
    //   "url": "/boundaries/federal-electoral-districts/62001/"
    //   },
    let boundaryDataObjects = boundaryData.data.objects;
    let districtsToSave = [];
    for(let i=0; i<boundaryDataObjects.length; i++) { 
      let districtData = await getDistrictData(boundaryDataObjects[i]);
      districtsToSave.push(districtData);
    }

    numberRecordsInserted += districtsToSave.length;
    DistrictModel.collection.insertMany(districtsToSave, function (err, docs) {
      if (err){ 
        log.error("Error when inserting documents to Collection");
        log.error(err);
      }

      log.debug("districtController docs inserted ", docs);
    });

    // nextURL is  /boundaries/federal-electoral-districts/?limit=20&offset=20
    let nextURL = boundaryData.data.meta.next;
    log.debug("nextURL is ", nextURL);
    hasNext = (nextURL !== null);
    if(hasNext) {
      boundariesURLQuery = `https://represent.opennorth.ca${nextURL}`;
      log.debug("boundariesURLQuery is ", boundariesURLQuery);
    }
  }

  return numberRecordsInserted;

}

const getDistrictData = async function(boundaryTest) {
  let districtName = boundaryTest.name;
  let districtNo = boundaryTest.external_id;
  let districtPartialURL = boundaryTest.url;
  let districtURL = `https://represent.opennorth.ca/${districtPartialURL}`;
  let districtBoundariesData = await axios.get(districtURL);

  // Get the latitude and longitude to centre the map on
  const longitude = districtBoundariesData.data.centroid.coordinates[0];
  const latitude = districtBoundariesData.data.centroid.coordinates[1];

  // Get an array listing the parties that are running in that district.
  const candidatesParties = await candidateController.getParties(latitude, longitude);
  const districtPolygonBoundary = await getDistrictBoundaries(districtBoundariesData);
  let id = new mongoose.Types.ObjectId();
  let insertDistrict = {
    _id: id,
    district_no: districtNo,
    district_name: districtName,
    parties: [candidatesParties],
    seat: null,
    location: {
      latitude: latitude,
      longitude: longitude,
      districtBoundaries: districtPolygonBoundary
    }
  };
  return insertDistrict;
}

async function getDistrictBoundaries(boundaryData) {
    // Then you get the shape_url
    let shapeURL = boundaryData.data.related.shape_url;
    let shapeURLQuery = `https://represent.opennorth.ca${shapeURL}`;
    let districtBoundary = await axios.get(shapeURLQuery);
    log.debug("shapeURL is ", shapeURL);
    log.debug("shapeURLQuery is ", shapeURLQuery);
    log.debug("districtBoundary is ", districtBoundary.data);
  
  
    // districtBoundary will look something like the following. (See ottawaCentreDistrictBoundaries.json for the full list.)
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

async function getDistricts() {
  let districts = await DistrictModel.find();
  return districts;
}

module.exports = {
  initializeDistricts : initializeDistricts,
  getDistricts : getDistricts,
  enterPartySeat : enterPartySeat,
  resetPartySeats : resetPartySeats
};


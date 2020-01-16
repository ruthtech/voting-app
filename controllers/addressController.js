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
  street: {
    number: 1,
    name: "Wellington Street"
  },
  city: "Ottawa",
  state: "Ontario",
  postcode: "K1A0A6",
  coordinates: {
    latitude: 45.424020,
    longitude: -75.696920
  },
  district: "Ottawa Centre",
  districtBoundaries: ottawaCentreDistrictBoundaries,
  districtURL: "Using default location: House of Commons in Ottawa",
  latLongURL: "Using default location: House of Commons in Ottawa",
  data: null
}

// Used only when fixing the database so that we know what fields could not be retrieved autoamatically
const emptyLocation = {
  street: {
    number: 0,
    name: ""
  },
  city: "",
  state: "",
  postcode: "",
  coordinates: { // just for fixing the database to make it easy to find which latitude/longitude need to be looked up manually
    latitude: 0,
    longitude: 0
  },
  district: "",
  districtBoundaries: [],
  districtURL: "",
  latLongURL: "",
  data: null
};

let defaultLocation = houseOfCommonsLocation;

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

function anyNumber(name) {
  return (name.match(/[0-9]+/));
}

// If the user wrote a correct postal code but a typo in the street name,
// this function will change that typo to the closest street with that name.
// If the postal code is completely wrong then this function will change the address
// to the one in the place_name
function initializeStreet(address, feature) {
  const place_name = feature.place_name;
  // The place_name can have several formats: 
  //    a) number/street/city/province/postalCode/Canada: 695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
  //    b) number/street/city/province/Canada: 9316 Main Street North, Murray River, Prince Edward Island, Canada
  //    c) street/city/province/Canada: Avenue of Nations, Edmonton, Alberta, Canada
  //    d) city/province/Canada: Wayerton, New Brunswick, Canada

  // First, figure out which of the four scenarios above we're dealing with.
  // If there is a street (options a, b, c), there are three commas.
  // If it's option d, there's no street to initialize, thus return the address as-is.
  var count = (place_name.match(/,/g) || []).length;
  if(count < 3) {
    return address;
  }

  // Option a, b, or c
  //    a) number/street/city/province/postalCode/Canada: 1 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
  //    b) number/street/city/province/Canada: 9316 Main Street North, Murray River, Prince Edward Island, Canada
  //    c) street/city/province/Canada: Avenue of Nations, Edmonton, Alberta, Canada
  
  // Looking at option c, if you look at the index of the first comma, are there any numbers before that comma?
  const firstCommaIndex = place_name.indexOf(',');
  const beforeFirstComma = place_name.substring(0, firstCommaIndex);
  if(anyNumber(beforeFirstComma)) {
    // e.g. 695 Dalhousie Avenue
    //      9316 Main Street North
    
    // Find the first space. The number will be before the space and the street name will be after the space.
    const firstSpaceIndex = beforeFirstComma.indexOf(' ');
    address.street.number = beforeFirstComma.substring(0,firstSpaceIndex);
    address.street.name = beforeFirstComma.substring(firstSpaceIndex+1);
    return address;
  }
  
  // e.g. Avenue of Nations
  if(!anyNumber(address.street.number)) {
    // We need a default number. If the user's number can't be found but everything else is okay then assume the user's number is correct.
    address.street.number = 0;
  }
  address.street.name = beforeFirstComma;
  return address;
}
  
// If this method is called then some information is missing.
// The address will be filled in partially from the default location.
function initializeCityProvinceFromString(address, place_name) {
  // The place_name can have several formats: 
  //    a) number/street/city/province/postalCode/Canada: 695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
  //    b) number/street/city/province/Canada: 9316 Main Street North, Murray River, Prince Edward Island, Canada
  //    c) street/city/province/Canada: Avenue of Nations, Edmonton, Alberta, Canada
  //    d) city/province/Canada: Wayerton, New Brunswick, Canada

  const lastCommaIndex = place_name.lastIndexOf(","); // Identifies where the ', Canada' string starts.
  const provinceStartCommaIndex = place_name.lastIndexOf(",", lastCommaIndex-1); 

  // Figure out which of the four scenarios above we're dealing with.
  // If there is a street (options a, b, c), there are three commas.
  // If it's option d, there are 2 commas.
  var count = (place_name.match(/,/g) || []).length;
  if(count < 3) {
    address.city = place_name.subtring(0, provinceStartCommaIndex); // If there's no street then the city is everything before the first comma
  } else {
    const cityStartCommaIndex = place_name.lastIndexOf(",", provinceStartCommaIndex-1);
    address.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();

    // Is there a postal code? Highly unlikely but check just in case
    address.postcode = getPostalCode(place_name);
  }
  address.state = place_name.substring(provinceStartCommaIndex+1, lastCommaIndex).trim();
  
  if(address.postcode === null) {
    address.postcode = defaultLocation.postcode;
  }
  address.coordinates.latitude = defaultLocation.coordinates.latitude;
  address.coordinates.longitude = defaultLocation.coordinates.longitude;

  return address;
}

// 
// Did the user enter a valid address in the Edit District page?
// Does this record from the database identify an address that exists?
//
// Don't look up the district or the district boundaries until the user clicks "Confirm" on the
// Edit District page because we want to avoid the performance hit until for sure the user has
// updated the address.
// 
async function getValidAddress(streetNo, streetName, city, province, postcode) {
  // Use this complicated structure to match the way the database is structured, which 
  // comes from the way that randomuser.me generates their objects. 

  // Invalid input
  if((postcode === null) || (postcode === undefined) || (postcode.trim() === '') ||
     (streetNo === null) || (streetNo === undefined) || (streetNo === 0) ||
     (streetName === null) || (streetName === undefined) || (streetName.trim() === '') ||
     (city === null) || (city === undefined) || (city.trim() === '')) {
    log.error("getValidAddress invalid input. No parameters can be null, undefined, or an empty string.");
    return { ...emptyLocation };
  }

  let address = {
    street: {
      number: streetNo,
      name: streetName
    },
    city: city,
    state: province,
    postcode: postcode.replace(/\s/g, "").trim(),
    coordinates: {
      latitude: defaultLocation.coordinates.latitude,
      longitude: defaultLocation.coordinates.longitude,
    },
    wasInvalid: false // assume by default that the address exists. Set to false only if we find a problem with it.
  };
  log.trace("getValidAddress, address is 1 ", address);

  try {
    let response = null;
    // Unfortunately mapbox doesn't return the street name or number if the postal code is valid.
    // This means that the user can enter a valid postal code and a street that doesn't exist. 
    // if(address.postcode !== null && address.postcode !== "") {
    //   address.postcode = address.postcode.replace(/\s/g, ""); 
    //   const postcodeSearch = address.postcode + ".json?types=postcode";
    //   let latLongURL = `${URLstart}${postcodeSearch}${otherParms}`;
    //   response = await axios.get(latLongURL);
    // }


    // Although searching on the postal code first gives us the district that we need, 
    // let's search on the address because we need to verify the entire address anyway,
    // and mapbox returns the postcode for a valid addrss.

    // Call mapbox again to see if the street exists.
    const eAddress = encodeURI(streetNo + " " + streetName + " " + city + " " + province);
    let addressURL = `${URLstart}${eAddress}.json?country=CA${otherParms}`;
    response = await axios.get(addressURL);

    // Focus on features with postal codes. 
    // We cannot find a voting district without the postal code. 
    let populateCityFromFeature = false; 
    let wasAddressFound = false;
    for(let i=0; i<response.data.features.length; i++) {
      let tempFeature = response.data.features[i];
      // Any number of features can be returned and in any order. Instead of picking
      log.debug("Debug getValidAddress, before 6 details are c ", tempFeature);
      for(let j=0; j<tempFeature.context.length; j++) {
        // O(N-squared) performance if this were ever large. Usually it's <5 features and <5 contexts. Wish there was another (faster) way to find the information.
        let tempContext = tempFeature.context[j];
        if(tempContext.id.startsWith('address')) {
          // Exact match. 
          address = initializeStreet(address, tempContext.text);
          wasAddressFound = true;
        } else if(tempContext.id.startsWith('postcode')) {
          // We found a location with a postcode. Use that.
          let tempPostCode = tempContext.text.replace(/\s/g, "").trim();
          address.wasInvalid = (address.postcode !== tempPostCode);
          address.postcode = tempPostCode;
          populateCityFromFeature = true;
        } else if(tempContext.id.startsWith('place')) {
          address.city = tempContext.text;
        } else if(tempContext.id.startsWith('region')) {
          address.state = tempContext.text;
        }
      }
      if (populateCityFromFeature) {
        address.coordinates.latitude = tempFeature.center[1];
        address.coordinates.longitude = tempFeature.center[0];
        if(!wasAddressFound) {
          address = initializeStreet(address, tempFeature);
        }
        break;
      }
    }

    if(populateCityFromFeature) return address;

    // None of the features have postal codes. Populate what we can.

    // We found an address in Canada. 
    // Sometimes the format looks like this: "place_name": 'Wayerton, New Brunswick, Canada',
    address = initializeStreet(address, response.data.features[0]);
    address = initializeCityProvinceFromString(address, response.data.features[0].place_name);
    log.warn("response data when some fields are from the default location ", response.data);

    return address;
  } catch ( error ) {
    log.error("Error when checking if address is valid ", error);
  }
}

// 
// It is required that the data be sanitized before this method is called. i.e., convertToValidLocation is called
// and its result is passed into this method. Otherwise a 404 will be thrown.
//
async function findDistrictNameAndBoundaries(data) {
  let location = {
    district: "",
    districtBoundaries: ""
  }
  try {
    let postcode = data.location.postcode.replace(/\s/g, ""); 

    // Now that we have a valid postal code, ask opennorth what district it belongs in.
    const districtURL = `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`;
    let districtData = await axios.get(districtURL);

    // And from that we get the district name.
    location.district = districtData.data.representatives_centroid[0].district_name;
    location.districtBoundaries = await getDistrictBoundaries(districtData.data);

    let dataClone = cloneData(data, location);

    return dataClone;
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
  log.debug("cloneData, districtLocation is ", districtLocation);
  log.debug("cloneData, data is ", data);

  // Cloning the data in the line below creates a _doc which contains the data.
  // Work around this by re-assigning the dataClone to the data that we want.
  let dataClone = { ...data };
  dataClone = dataClone._doc;

  log.debug("cloneData, dataClone is ", dataClone);
  log.debug("cloneData, dataClone.location is ", dataClone.location);
  dataClone.location.district = districtLocation.district;
  dataClone.location.districtBoundaries = districtLocation.districtBoundaries;
  log.debug("cloneData, districtBoundaries are ", dataClone.location.districtBoundaries);
  log.debug("cloneData, latitude is ", dataClone.location.coordinates.latitude);
  log.debug("cloneData, longitude is ", dataClone.location.coordinates.longitude);
  return dataClone;
}

// Given a retrieved user from the database, calculate the following:
//    1. Based on their address, which district they vote in.
//    2. The boundaries (polygon) of that district.
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

module.exports = {
  getValidAddress : getValidAddress,
  defaultLocation : defaultLocation,
  findDistrictNameAndBoundaries : findDistrictNameAndBoundaries
};


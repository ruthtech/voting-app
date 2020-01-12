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

// 
// Did the user enter a valid address in the Edit District page?
// Does this record from the database identify an address that exists?
//
async function getValidAddress(streetNo, streetName, city, province, postcode) {
  // Use this complicated structure to match the way the database is structured, which 
  // comes from the way that randomuser.me generates their objects. 
  let address = {
    street: {
      number: streetNo,
      name: streetName
    },
    city: city,
    state: province,
    postcode: postcode.replace(/\s/g, ""),
    coordinates: {
      latitude: defaultLocation.latitude,
      longitude: defaultLocation.longitude,
    },
    wasInvalid: false // assume by default that the address exists. Set to false only if we find a problem with it.
  };
  log.debug("getValidAddress, address is 1 ", address);

  try {
    let response = null;
    if(address.postcode !== null && address.postcode !== "") {
      address.postcode = address.postcode.replace(/\s/g, ""); 
      const postcodeSearch = address.postcode + ".json?types=postcode";
      let latLongURL = `${URLstart}${postcodeSearch}${otherParms}`;
      response = await axios.get(latLongURL);
    }
    log.trace("getValidAddress, address is 2 ", address);

    if(response.data.features.length !== 0) {
      // Great, that's all that we need to generate an election district. 
      // Is the rest of the address valid?
      // Format: A0A 0A0, Toronto, Ontario, Canada

      const placeName = response.data.features[0].place_name;
      const cityStartIndex = placeName.indexOf(",");
      const provinceStartIndex = placeName.indexOf(",", cityStartIndex+1);
      const provinceEndIndex = placeName.indexOf(",", provinceStartIndex+1);
      const postcode = placeName.substring(0,7).trim().replace(/\s/g, "");
      const city = placeName.substring(cityStartIndex+1,provinceStartIndex).trim();
      const province = placeName.substring(provinceStartIndex+1,provinceEndIndex).trim();
    
      log.debug("Look for latitude and longitude in response.data ", response.data);
      log.debug("center is ", response.data.features[0].center);
      log.debug("responseLocation city equal address city? ", (city === address.city));
      log.debug("responseLocation province equal address province? ", (province === address.province));
      log.debug("responseLocation postcode equal address postcode? ", (postcode.replace(/\s/g, "") === address.postcode.replace(/\s/g, "")));

      address.coordinates.latitude = response.data.features[0].center[1];
      address.coordinates.longitude = response.data.features[0].center[0];
      log.debug("getValidAddress. 1. Latitude " + address.coordinates.latitude + " and longitude " + address.coordinates.longitude);

      // Postal code can be either form, both of which are equivalent: A0A 0A0 or A0A0A0
      if( (city === address.city) && 
          (province === address.state) && 
          (postcode === address.postcode)) {
        // The rest of the address is valid
        log.trace("getValidAddress, address is 3 ", address);
        return address;
      }
    } 

    // mapbox couldn't find the postal code. Search via the address and "Canada" instead.
    address.wasInvalid = true;
    const eAddress = encodeURI(streetNo + " " + streetName);
    let latLongURL = `${URLstart}${eAddress}.json?country=CA${otherParms}`;
    response = await axios.get(latLongURL);

    
    if(response.data.features.length === 0) {
      // Still can't find it? No such address in Canada? 
      // Shouldn't happen but just in case, resort to default addres (House of Commons in Ottawa).
      address.city = defaultLocation.city;
      address.state = defaultLocation.province;
      address.postcode = defaultLocation.postcode;
      address.coordinates.latitude = defaultLocation.latitude;
      address.coordinates.longitude = defaultLocation.longitude;
      log.info("getValidAddress. Using default location. 1. Latitude " + address.coordinates.latitude + " and longitude " + address.coordinates.longitude);

      log.trace("getValidAddress, address is 4 ", address);
    } else {
      address.coordinates.latitude = response.data.features[0].center[1];
      address.coordinates.longitude = response.data.features[0].center[0];
      log.info("getValidAddress. 2. Latitude " + address.coordinates.latitude + " and longitude " + address.coordinates.longitude);

      // We found an address in Canada. To find the postal code we need to parse it out of the feature's place_name.
      // Format looks something like this: "place_name": "695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada"
      // Sometimes the format looks like this: "place_name": 'Wayerton, New Brunswick, Canada',
      const place_name = response.data.features[0].place_name;
      const lastCommaIndex = place_name.lastIndexOf(",");
      const provinceStartCommaIndex = place_name.lastIndexOf(",", lastCommaIndex-1);
      const cityStartCommaIndex = place_name.lastIndexOf(",", provinceStartCommaIndex-1);
      address.postcode = getPostalCode(place_name);
      log.debug("Debug getValidAddress, before 5, response.data is ", response.data);
      if(address.postcode !== null) {

        // 695 Dalhousie Avenue, Saint Catharines, Ontario L2N 4X9, Canada
        // We know that the postal code is right before the country, so subtract 7 characters and extract
        // just those 7.
        // We know that postcode exists in Canada because mapbox returns only valid addresses.
        const canadaIndex = place_name.indexOf(", Canada");
        const streetNoAndName = place_name.substring(0,cityStartCommaIndex);
    
        // Extract the correct city name (everything after the first comma and before the second comma)
        // Extract the correct province (everything after the second comma and before the postal code)
        address.street.number = streetNoAndName.substring(0, streetNoAndName.indexOf(' '));
        address.street.name = streetNoAndName.substring(streetNoAndName.indexOf(' ')).trim();
        address.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
        address.province = place_name.substring(provinceStartCommaIndex+1, canadaIndex-7).trim();
        log.debug("Debug getValidAddress, place_name is " + place_name);
        log.trace("provinceStartCommaIndex+1 is " + (provinceStartCommaIndex+1) + " and canadaIndex-7 is " + (canadaIndex-7));
        log.debug("Debug getValidAddress, address is 5 ", address);
     } else {
        // There's no postal code or street address. 
        // e.g. Wayerton, New Brunswick, Canada
        //      9316 Main Street North, Murray River, Prince Edward Island, Canada
        // While we could get an API key with Canada Post, for now we will use the default 
        // postal code (Canada's House of Commons) with the mapbox city and province in the address.
        // 
        let firstCommaIndex = place_name.lastIndexOf(cityStartCommaIndex-1);
        if(firstCommaIndex < 0) {
          address.city = place_name.substring(cityStartCommaIndex+1, provinceStartCommaIndex).trim();
        } else {
          address.city = place_name.substring(firstCommaIndex+1, cityStartCommaIndex).trim();
        }
        address.state = place_name.substring(provinceStartCommaIndex+1, lastCommaIndex).trim();
        address.postcode = defaultLocation.postcode;
        log.debug("response data for no postal code is ", response.data);
        address.coordinates.latitude = defaultLocation.latitude;
        address.coordinates.longitude = defaultLocation.longitude;
        log.info("getValidAddress. Using default location. 2. Latitude " + address.coordinates.latitude + " and longitude " + address.coordinates.longitude);

        log.trace("getValidAddress, address is 6 ", address);
      }
    }

    log.debug("Debug getValidAddress, output before returning is ", address);

    return address;
  } catch ( error ) {
    log.error("Error when checking if address is valid ", error);
  }
}

module.exports = {
  getValidAddress : getValidAddress
};


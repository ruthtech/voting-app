const express = require("express");
const router = express.Router();
const Voter = require("../controllers/voterController");
const Simulator = require('../controllers/simulationController');
const Candidate = require("../controllers/candidateController");
const Address = require("../controllers/addressController"); 
const District = require("../controllers/districtController");
const log = require('loglevel');
require('dotenv').config();

if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

// Retrieve the voter with the given username and password.
// If no such voter is found, return an object with isVerified: false.
// If the voter is found, isVerified will point to that voter object.
//
// This has to be post/put/patch instead of get in order to transfer data
// to this endpoint via the request body instead of the URL. Better to transfer
// data via the body in order to not expose the password in plain text.
// 
router.post("/api/v1/login", async function(req, res) {
  try {
    // Move the password into the request body to make it harder to hack.
    const user = {
      isVerified: await Voter.verifyUser(
        req.body.username,
        req.body.password
      )
    };
    // console.log("apiroutes Does user have a distrct? ", user);
    res.send(user);
  } catch (err) {
    // Internal error on the server side.
    log.error("/api/v1/voters/", req.body.username);
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Return all of the candidates for a given district
router.get("/api/v1/candidates/:postcode", async function(req, res) {
  try {
    const candidates = {
      candidateList: await Candidate.findCandidates(
        req.params.postcode.replace(/\s/g, "")
      )
    };
    res.status(200);
    res.send(candidates);
  } catch (err) {
    // Internal error on the server side.
    log.error("/api/v1/candidates/:postcode");
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Voter votes for a candidate.
router.put("/api/v1/candidates/:candidateId", async function(req, res) {
  const candidateId = req.params.candidateId;
  try {
    const voterId = req.body.voterId;
    log.debug(`/api/v1/candidates/${candidateId}`);
    const newVoteTally = {
      voter: await Voter.enterVote(voterId),
      votecast: await Candidate.enterVote(candidateId)
    };
    res.status(200);
    res.send(newVoteTally);
  } catch (err) {
    log.error(`/api/v1/candidates/:${candidateId}`);
    log.error(err);
    res.status(500);
    res.send(err);
  }
});

// Update each district with a RNG to indicate which person/party won the district.
router.put("/api/v1/simulation/run", async function(req, res) {
  try {
    let districts = await Simulator.runSimulation();
    res.status(200);
    res.send(districts);
  } catch ( error ) {
    res.status(500);
    res.send(error);
  }
});

// Update each district to indicate that no vote has happened yet. 
router.put("/api/v1/simulation/reset", async function(req, res) {
  try {
    let districts = await Simulator.resetSimulation();
    res.status(200);
    res.send(districts);
  } catch ( error ) {
    res.status(500);
    res.send(error);
  }
});

router.get("/api/v1/districts", async function(req, res) {
  try {
    let success = await District.getDistricts();
    res.status(200);
    res.send(success);
  }
  catch ( error ) {
    res.status(500);
    res.send(error);
  }
});

// Return the candidate with the given id
// router.get("/api/candidate/:id", async function(req, res) {
//   try {
//     const id = req.params.id;
//     let candidates = mockData.mockCandidates.filter(candidate => {
//       return candidate.id === id;
//     });
//     res.status(200);
//     res.send(candidates.length < 1 ? {} : candidates[0]);
//   } catch (err) {
//     // Internal error on the server side.
//     console.log(err);
//     res.status(500);
//     res.send(err);
//   }
//   return res;
// });

// Given a user and address, update the user's address. District, latitude, and longitude will be calculated.
router.put("/api/v1/voters/:username",
  async function(req, res) {
    try {
      const username = decodeURI(req.params.username);
      const streetNo = decodeURI(req.body.streetNo);
      const streetName = decodeURI(req.body.streetName);
      const city = decodeURI(req.body.city);
      const province = decodeURI(req.body.province);
      const postcode = decodeURI(req.body.postcode); 

      log.debug(`apiroutes /api/v1/voters/:username ${username} ${streetNo} ${streetName} ${city} ${province} ${postcode}`);

      let user = await Voter.updateAddress(username, streetNo, streetName, city, province, postcode);

      res.status(200);
      res.send(user);
    } catch (err) {
      // Internal error on the server side.
      log.error("/api/v1/voters/:username");
      log.error(err);
      res.status(500);
      res.send(err);
    }
    return res;
  }
);

/* 
  If the address is valid, return it.

  Otherwise return the closest existing address.
*/
router.post("/api/v1/verifyAddress", async function (req, res) {
  try {
    const streetNo = decodeURI(req.body.streetNo);
    const streetName = decodeURI(req.body.streetName);
    const city = decodeURI(req.body.city);
    const province = decodeURI(req.body.province);
    const postcode = decodeURI(req.body.postcode); 

    let address = await Address.getValidAddress(streetNo, streetName, city, province, postcode); 

    res.status(200);
    res.send(address);
  } catch (err) {
    // Internal error on the server side.
    log.error("/api/v1/verifyAddress");
    log.error(req.body);
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// This should not be called by anyone other than the developers of this tool.
// 
// Take logging messages from React and include them in the server log so that we can see 
// the order of operations. Plus if the user never opens the debug tools in their browser
// the React error messages would be lost if they weren't sent here. 
router.post("/internal/v1/logger", async function(req, res) {
  const logs = req.body.logs;
  for (const logEntry of logs) {
    const level = logEntry.level;
    switch(level) {
      case('trace'): {
        log.trace(logEntry.msg);
        if(logEntry.stacktrace.trim() !== '') {
          log.trace(logEntry.stacktrace);
        }
        break;
      }

      case('debug'):
      case('log'): {
        log.debug(logEntry.msg);
        if(logEntry.stacktrace.trim() !== '') {
          log.debug(logEntry.stacktrace);
        }
        break;
      }

      case('info'): {
        log.info(logEntry.msg);
        if(logEntry.stacktrace.trim() !== '') {
          log.info(logEntry.stacktrace);
        }
        break;
      }

      case('error'): {
        log.error(logEntry.msg);
        if(logEntry.stacktrace.trim() !== '') {
          log.error(logEntry.stacktrace);
        }
        break;
      }

      case('warn'): 
      default: {
        log.warn(logEntry.msg);
        if(logEntry.stacktrace.trim() !== '') {
          log.warn(logEntry.stacktrace);
        }
      }
    }
  }

  res.status(200);
  res.send({});
});

// This should not be called by anyone other than the developers of this tool. 
// It should only need to be called once.
// 
// When the voter database was created, randomuser.me was used to generate values.
// Unfortunately randomuser.me addresses do not exist. That means that we can't generate
// a map or figure out what district a user votes in.
// This method will kick off a script that loads every record in the database, reads its
// address to see if it exists, and if it does, the script updates the record's
// latitude, longitude, address, etc.
//
// The unnecessary data (e.g. timezones) will be deleted.
//
router.put("/internal/v1/fixdb", async function(req, res) {
   try {
     let success = await Voter.fixDatabase();
     if(success) {
       res.status(200);
     } else {
       res.status(500);
     }
     res.send(success);
   }
   catch ( error ) {
     res.status(500);
     res.send(error);
   }
});

router.put("/internal/v1/initDistricts", async function(req, res) {
  try {
    let numRecordsInserted = await District.initializeDistricts();
    res.status(200);
    res.send(numRecordsInserted.toString());
  }
  catch ( error ) {
    res.status(500);
    res.send(error);
  }
});

module.exports = router;

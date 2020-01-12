const express = require("express");
const router = express.Router();
const Voter = require("../controllers/voterController");
const Simulator = require('../controllers/simulationController');
const Candidate = require("../controllers/candidateController");
const Address = require("../controllers/addressController"); // Not a controller because it does not speak with a database, just mapbox
const log = require('loglevel');
require('dotenv').config();

if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

router.get("/api/login/:username/:password", async function(req, res) {
  try {
    const user = {
      isVerified: await Voter.verifyUser(
        req.params.username,
        req.params.password
      )
    };
    // console.log("apiroutes Does user have a distrct? ", user);
    res.send(user);
  } catch (err) {
    // Internal error on the server side.
    log.error("/api/login/:username/:password");
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Return all of the candidates for a given district
router.get("/api/candidates/:postcode", async function(req, res) {
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
    log.error("/api/candidates/:postcode");
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Vote for a candidate and log event that user has voted
router.put("/api/voter/:voterid/:candidateId", async function(req, res) {
  try {
    log.debug(`/api/voter/${req.params.voterid}/${req.params.candidateId}`);
    const newVoteTally = {
      voter: await Voter.enterVote(req.params.voterid),
      votecast: await Candidate.enterVote(req.params.candidateId)
    };
    res.status(200);
    res.send(newVoteTally);
  } catch (err) {
    log.error(`/api/voter/${req.params.voterid}/${req.params.candidateId}`);
    log.error(err);
    res.status(500);
    res.send(err);
  }
});

// Put instead of post because we are updating records, not creating new ones
router.put("/api/simulator/run", async function(req, res) {
  res.status(200);
  res.send(Simulator.runSimulation());
});

router.put("/api/simulator/reset", async function(req, res) {
  res.status(200);
  res.send(Simulator.resetSimulation());
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
router.put("/api/updateAddress/:username/:streetno/:streetname/:city/:province/:postcode",
  async function(req, res) {
    try {
      const username = decodeURI(req.params.username);
      const streetNo = decodeURI(req.params.streetno);
      const streetName = decodeURI(req.params.streetname);
      const city = decodeURI(req.params.city);
      const province = decodeURI(req.params.province);
      const postcode = decodeURI(req.params.postcode); 

      let user = await Voter.updateAddress(username, streetNo, streetName, city, province, postcode);

      res.status(200);
      res.send(user);
    } catch (err) {
      // Internal error on the server side.
      log.error("/api/updateAddress/:username/:streetno/:streetname/:city/:province/:postcode");
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
router.get("/api/address/:streetno/:streetname/:city/:province/:postcode", async function (req, res) {
  try {
    const streetNo = decodeURI(req.params.streetno);
    const streetName = decodeURI(req.params.streetname);
    const city = decodeURI(req.params.city);
    const province = decodeURI(req.params.province);
    const postcode = decodeURI(req.params.postcode); 

    let address = await Address.getValidAddress(streetNo, streetName, city, province, postcode); 

    res.status(200);
    res.send(address);
  } catch (err) {
    // Internal error on the server side.
    log.error("/api/address/:streetno/:streetname/:city/:province/:postcode");
    log.error(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Take logging messages from React and include them in the server log so that we can see 
// the order of operations. Plus if the user never opens the debug tools in their browser
// the React error messages would be lost if they weren't sent here. 
router.post("/logger", async function(req, res) {
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

module.exports = router;

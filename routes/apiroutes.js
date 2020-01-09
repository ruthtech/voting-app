const express = require("express");
const router = express.Router();
var voter = require("../controllers/votercontroller");
const log = require('loglevel');
require('dotenv').config();

if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

router.get("/api/login/:username/:password", async function(req, res) {
  try {
    const user = {
      isVerified: await voter.verifyUser(
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
      candidateList: await voter.findCandidates(
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
router.post("/api/voter/:voterid/:candidateId", async function(req, res) {
  try {
    const tallyVote = {
      votecast: await voter.enterVote(req.body.voterid, req.body.candidateId)
    };
  } catch (err) {
    log.error("/api/login/:username/:password");
    log.error(err);
    res.send(err);
  }
});

//
router.post("/api/run/simulator", async function(req, res) {
  voter.runSimulation();
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

      let user = await voter.updateAddress(username, streetNo, streetName, city, province, postcode);

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

  Otherwise return the closest valid address.
*/
router.get("/api/address/:streetno/:streetname/:city/:province/:postcode", async function (req, res) {
  try {
    const streetNo = decodeURI(req.params.streetno);
    const streetName = decodeURI(req.params.streetname);
    const city = decodeURI(req.params.city);
    const province = decodeURI(req.params.province);
    const postcode = decodeURI(req.params.postcode); 

    // false means do not update the address in the database if it's invalid. Edit District Confirm may not click "Save"; they may click "Edit".
    let address = await voter.getValidAddress(streetNo, streetName, city, province, postcode, false); 

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

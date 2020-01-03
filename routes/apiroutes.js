const express = require("express");
const router = express.Router();
const db = require("../models");
var voter = require("../controllers/votercontroller");

// const voter = new Voter();

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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
    res.send(err);
  }
});

//
router.post("/api/run/simulator", async function(req, res) {
  console.log("Running Simulator");
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
      const username = req.params.username;
      const streetNo = req.params.streetno;
      const streetName = req.params.streetname;
      const city = req.params.city;
      const province = req.params.province;
      const postcode = req.params.postcode; 

      let user = await voter.updateAddress(username, streetNo, streetName, city, province, postcode);

      res.status(200);
      res.send(user);
    } catch (err) {
      // Internal error on the server side.
      console.log(err);
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
    const streetNo = req.params.streetno;
    const streetName = req.params.streetname;
    const city = req.params.city;
    const province = req.params.province;
    const postcode = req.params.postcode; 

    let address = await voter.getValidAddress(streetNo, streetName, city, province, postcode);

    res.status(200);
    res.send(address);
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});


module.exports = router;

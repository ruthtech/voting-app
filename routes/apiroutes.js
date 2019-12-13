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
router.get("/api/candidates/:postalcode", async function(req, res) {
  console.log("The Candidates are /api/candidates/:postalcode");
  try {
    const candidates = {
      candidateList: await voter.findCandidates(req.params.postalcode)
    };
    console.log("The Candidates are ", candidates);
    // console.log("/api/candidates/" + district);
    // console.log(mockData);
    // console.log(mockData.mockCandidates);
    // let candidates = mockData.mockCandidates.filter(candidate => {
    //   return candidate.district == district;
    // });
    // console.log(candidates);
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

// CHANGE BELOW THIS LINE
// Given an address, return the district that the address is in
router.get("/api/findDistrict/:address/:city/:province", async function(
  req,
  res
) {
  try {
    const province = req.params.province;
    let districts = mockData.mockDistricts.filter(district => {
      return district.province == province;
    });
    res.status(200);
    res.send(districts.length < 1 ? {} : districts[0]);
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Given a user, an address and a district, update the user's record to have that address and district.
router.put(
  "/api/updateAddress/:id/:address/:city/:province/:district",
  async function(req, res) {
    try {
      const province = req.params.province;
      let districts = mockData.mockDistricts.filter(district => {
        return district.name == province;
      });
      res.status(200);
      res.send(districts.length < 1 ? {} : districts[0]);
    } catch (err) {
      // Internal error on the server side.
      console.log(err);
      res.status(500);
      res.send(err);
    }
    return res;
  }
);

// router.get('/api/test', async function (req, res) {
//   try {
//     res.status(200);
//     res.send({ message: "Test received from express."});
//   } catch (err) {
//     // Internal error on the server side.
//     console.log(err);
//     res.status(500);
//     res.send(err);
//   }
//   return res;
// });

module.exports = router;

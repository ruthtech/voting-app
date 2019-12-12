const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const mockData = require('./mockData'); // This will be removed once the database exists

const voter = new Voter();

// Return the user with the UUID and password if the UUID exists and the password
// is the correct password.
router.get('/api/:id/:password', async function (req, res) {
  try {

    let user = {
      uuid: req.params.id,
      isVerified: false
    };
    if(await voter.verifyPassword(req.params.id, req.params.password)) {
      res.status(200);
      user.isVerified = true;
      
    } else {
      res.status(404);
    }
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
router.get('/api/candidates/:district', async function (req, res) {
  try {
    const district = req.params.district;
    let candidates = mockData.mockCandidates.filter( (candidate) => { return candidate.district === district} );
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
router.get('/api/candidate/:id', async function (req, res) {
  try {
    const id = req.params.id;
    let candidates = mockData.mockCandidates.filter( (candidate) => { return candidate.id === id} );
    res.status(200);
    res.send((candidates.length < 1) ? {} : candidates[0]);
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

// Given an address, return the district that the address is in 
router.get('/api/updateaddress/:address/:city/:province', async function (req, res) {
  try {
    const province = req.params.province;
    let districts = mockData.mockDistricts.filter( (district) => { return district.name === province} );
    res.status(200);
    res.send((districts.length < 1) ? {} : districts[0]);
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});


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

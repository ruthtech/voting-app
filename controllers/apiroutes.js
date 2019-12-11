const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');

const voter = new Voter();

router.get('/api/:id/:password', async function (req, res) {
  try {
    // console.log("api route for verifying password has been hit");
    // console.log(req.params.id);
    // console.log(req.params.password);
    res.status(200);
    const user = {
      isVerified: await voter.verifyPassword(req.params.id, req.params.password)
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

router.get('/api/test', async function (req, res) {
  try {
    res.status(200);
    res.send({ message: "Test received from express."});
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});


module.exports = router;

const express = require("express");
const router = express.Router();

const Voter = require(`Voter`);

router.post("/api/:id/:password", async function(req, res) {
  try {
    res.status(200);
    res.send(
      await userDBAccess.verifyPassword(req.params.id, req.params.password)
    );
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

router.get("/api/test", async function(req, res) {
  try {
    res.status(200);
    res.send({ message: "Test received from express." });
  } catch (err) {
    // Internal error on the server side.
    console.log(err);
    res.status(500);
    res.send(err);
  }
  return res;
});

module.exports = router;

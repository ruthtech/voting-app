db = require("../models");
axios = require("axios");

exports.verifyUser = async function(username, password) {
  let data;
  try {
    data = await db.voter.findOne({
      "login.username": username,
      "login.password": password
    }).exec();

    console.log(data);
    if (!data) {
      console.log("DEBUG username is " + username + " and password is " + password);
      return false;
    }


    let postalcode = data.location.postcode.replace(/\s/g, ""); // Does this need %20 to be substituted for the space?
    console.log("Trying to find district with postal code ");
    console.log(`https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`);

    // Now we need to find out what district this user is in
    let districtData = await axios.get(
      `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`
    );

    let district = districtData.data.candidates_centroid[0].district_name;

    let dataClone = { ...data };
    dataClone._doc.location.district = district;
    console.log("data clone is ", dataClone);
    return dataClone;
  } catch ( err ) {
    console.log(err);
    return false;
  }
};

exports.createNewVoter = async function(voterInfo) {
  let newVoter = new db.voter(voterInfo);
  let result = await newVoter.save();

  res.send(result);
};

exports.updateVote = async function(req, res) {
  let result = await db.voter.findOneAndUpdate(
    { uuid: req.params.uuid },
    {
      $set: {
        "name.title": req.body.title,
        "name.first": req.body.first_name,
        "name.last": req.body.last_name,
        "name.gender": req.body.gender,
        "location.street.number": req.body.street_no,
        "name.location.street.": req.body.street_name,
        "location.city": req.body.city,
        "location.state": req.body.province,
        "location.postcode": req.body.postalcode,
        "location.country": req.body.country
      }
    }
  );
  res.send(result);
};

exports.enterVote = async function(voter, candidateid) {
  let newVoteTally = await db.candidate.findOneAndUpdate(
    { _id: candidateid },
    { $inc: { votes_for: 1 } }
  );

  let voteCast = await db.voter.findOneAndUpdate(
    { _id: voterid },
    { $set: { hasvoted: true } }
  );
  res.send(newVoteTally);
};

exports.findCandidates = async function(postalcode) {
  let data = await axios.get(
    `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`
  );
  let candidateList = await db.candidate.find({
    district_name: data.data.candidates_centroid[0].district_name
  });
  // console.log("Candidate list is ", candidateList);
  //   for (i = 0; i < candidateList.length; i++) {
  //     let apiData = await axios.get(
  //       `https://represent.opennorth.ca/candidates/?last_name=${candidateList[i].last_name}&first_name=${candidateList[i].first_name}&format=json`
  //     );
  //      console.log("Source is ", apiData.data.objects);
  //      console.log("The Data is ", apiData);
  //      districtCandidates.push(apiData.offices);
  //   }
  //      console.log("New candidate list is ", districtCandidates);
  return candidateList;
};

exports.runSimulation = async function() {
  for await (const voterList of db.voter.findOne()) {
    let postcode = voterList.location.postcode.replace(/\s/g, "");
    await setInterval(async function() {
      //   await console.log(
      //     `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
      //   );
      let district = await axios.get(
        `https://represent.opennorth.ca/postcodes/${postcode}/?sets=federal-electoral-districts&format=json`
      );
      await console.log(
        "District is ",
        district.data.candidates_centroid[0].district_name
      );

      //   let candidateList = await db.candidate.find({
      //     district_name: district.data.candidates_centroid[0].district_name
      //   });
      //   console.log("Candidate list is ", candidateList);

      //   if (candidateList.length > 0) {
      //     let newVoteTally = await db.candidate.findOneAndUpdate(
      //       {
      //         _id:
      //           candidateList[Math.floor(Math.random() * candidateList.length)]
      //             ._id
      //       },
      //       { $inc: { votes_for: 1 } }
      //     );

      //     let voteCast = await db.voter.findOneAndUpdate(
      //       { _id: voterList._id },
      //       { $set: { hasvoted: true } }
      //     );
      // Math.floor(Math.random() * candidateList.length);
      //   }
      console.log(voterList.name);
    }, 60000);
  }
};

exports.updateAddress = async function(username, streetNo, streetName, city, province, postalCode) {
  try {
    let data = await db.voter.findOneAndUpdate(
      { "location.username": username },
      {
        $set: {
          "location.street.number": streetNo,
          "name.location.street.": streetName,
          "location.city": city,
          "location.state": province,
          "location.postcode": postalCode
        }
      }
    ).exec();

    data = await db.voter.findOne({
      "login.username": username
    }).exec();

    let postalcode = data.location.postcode.replace(/\s/g, ""); // Does this need %20 to be substituted for the space?
    console.log("Trying to find district with postal code ");
    console.log(`https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`);

    // Now we need to find out what district this user is in
    let districtData = await axios.get(
      `https://represent.opennorth.ca/postcodes/${postalcode}/?sets=federal-electoral-districts&format=json`
    );

    let district = districtData.data.candidates_centroid[0].district_name;

    let dataClone = { ...data };
    dataClone._doc.location.district = district;
    // Send back the user that was just updated
    console.log("data clone is ", dataClone);
    return dataClone;
  } catch ( error ) {
    console.log(error);
    return false;
  }
};


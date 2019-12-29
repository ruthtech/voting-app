const express = require("express");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiRoutes = require("./routes/apiroutes");


// const VoterModel = require('./models/Voter');
// const PartyModel = require('./models/Party');

// const verifyUser = async (username, password) => {
//   let data;
//   try {
//     data = await VoterModel.findOne({
//       "login.username": username,
//       "login.password": password
//     }).exec();

//     console.log(data);
//     if (!data) {
//       console.log("DEBUG username is " + username + " and password is " + password);
//       return false;
//     }
//     return data;
//   } catch ( err ) {
//     console.log(err);
//     return false;
//   }
// };


// try {
//   app.get("/", async (req, res) => {
//     try {
//       PartyModel.find({})
//       .then(doc => {
//         console.log("then ", doc)
//       })
//       .catch(err => {
//         console.error("error ", err);
//       });
//       res.status(200);
//       const party = await PartyModel.find({});
//       console.log("user ", party);
//       res.send(party);
//     } catch (err) {
//       // Internal error on the server side.
//       console.log(err);
//       res.status(500);
//       res.send(err);
//     }
//   });

//   app.get("/api/login/:username/:password", async (req, res) => {
//     try {
//       const foundUser = await verifyUser(req.params.username, req.params.password);
//       console.log(foundUser);
//       const user = {
//         isVerified: foundUser
//       };
//       console.log(user);
//       res.status(200);
//       res.send(user);
//     } catch (err) {
//       // Internal error on the server side.
//       console.log(err);
//       res.status(500);
//       res.send(err);
//     }
//     return res;
//   });
// } catch(err){
//   console.error( `oops error: ${err}`);
// };

// Routes for data from MySQL
app.use(apiRoutes);

// Parse response?
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

// Serve the React components and assets
app.use(express.static(path.join(__dirname, "client/build")));

// Since this will match every path that isn't explicitly listed above,
// make sure that this is listed after the data api routes/endpoints.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});
// End Serve the React components and assets

// Close your database connection when Node exits
process.on("exit", async function(code) {
  return console.log(`About to exit with code ${code}`);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

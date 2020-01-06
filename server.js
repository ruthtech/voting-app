const express = require("express");
const path = require("path");

const port = process.env.PORT || 5000;

const app = express();
const bodyParser = require("body-parser");
const log = require('loglevel');
require('dotenv').config();

if(process.env.LOGGING_LEVEL) {
  log.setLevel(process.env.LOGGING_LEVEL);
}

//app.use(express.urlencoded({ extended: true }));
//app.use(express.json());

const apiRoutes = require("./routes/apiroutes");

// Routes for data from the database
app.use(apiRoutes);

// Parse response?
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
  return log.warn(`About to exit with code ${code}`);
});

app.listen(port, () => log.warn(`Listening on port ${port}`));

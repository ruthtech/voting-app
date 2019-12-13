const express = require("express");
const path = require("path");
const Connection = require("./config/connection");

const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require(path.join(__dirname, "routes", "apiroutes"));
const db = require("./models");

// Routes for data from MySQL
app.use(apiRoutes);
// console.log("Server is loading apiroutes");
// console.log(apiRoutes);

// Parse response?
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// if (process.env.MONGODB_URI) {
//   mongoose.connect(
//     process.env.MONGODB_URI || "mongodb://localhost:27017/online_voters_db",
//     {
//       useNewUrlParser: true,
//       useFindAndModify: false
//     }
//   );
// }

// class Database {
//   constructor(config) {
//     this.connection = mysql.createConnection(config);
//   }
//   query(sql, args) {
//     return new Promise((resolve, reject) => {
//       this.connection.query(sql, args, (err, rows) => {
//         if (err) return reject(err);
//         resolve(rows);
//       });
//     });
//   }
//   close() {
//     return new Promise((resolve, reject) => {
//       this.connection.end(err => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });
//   }
// }

// //adding JAWSDB connection if else
// if (process.env.JAWSDB_URL) {
//   db = new Database(process.env.JAWSDB_URL);
// } else {
//   db = new Database({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     // Kevins root password: "IamTheBoxGhost1971",
//     password: "IamTheBoxGhost1971",
//     database: "online_voter_db"
//   });
// }

// Serve the React components and assets
app.use(express.static(path.join(__dirname, "client/build")));

console.log("");

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

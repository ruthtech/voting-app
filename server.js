const express = require("express");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require(path.join(__dirname, "controllers", "apiroutes"));

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, "client/build")));

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

//adding JAWSDB connection if else
if (process.env.JAWSDB_URL) {
  db = new Database(process.env.JAWSDB_URL);
} else {
  db = new Database({
    host: "localhost",
    port: 3306,
    user: "root",
    // Kevins root password: "IamTheBoxGhost1971",
    password: "IamTheBoxGhost1971",
    database: "online_voter_db"
  });
}

app.get("https://randomuser.me/api/?results=5000&nat=CA", async (req, res) => {
  console.log(req);
  const voterInput = [...req];
  // await db.query(`insert into voters(uuid, password, salt, md5, firstname, lastname, age, gender, birthdate, cell, city, country, email,
  //   hiredate, idnumber, idtype, nat, phone, picture_large, picture_medium, picture_thumbnail, serviceyears, streetname, streetno, title)`,
  // [req.]);
  // res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// Routes
app.use(apiRoutes);

// Close your database connection when Node exits
process.on("exit", async function(code) {
  return console.log(`About to exit with code ${code}`);
});

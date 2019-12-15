require("dotenv").config();
// const mysql = require('mysql');
const mysql = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// if (process.env.MONGODB_URI) {
const Connection = mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/online_voter_db",
  {
    useNewUrlParser: true,
    useFindAndModify: false
  },
  err => {
    console.log(err);
  }
);
// }

module.exports = Connection;

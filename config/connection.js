require('dotenv').config();
const mysql = require('mysql');

class Connection {
  constructor() {
    if (process.env.JAWSDB_URL) {
      this.connection = mysql.createConnection(process.env.JAWSDB_URL);
    } else {
      this.connection = mysql.createConnection({
          host: 'localhost',
          port: 3306,
          user: 'root',
          password: process.env.PASSWORD,
          database: 'voters_db'
        });
    }
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          console.log(err);
          console.log(err.sql);
          console.log('');
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) {return reject(err); }
        resolve();
      });
    });
  }
}

module.exports = Connection;

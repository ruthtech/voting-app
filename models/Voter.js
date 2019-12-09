let CryptoJS = require('crypto-js');
let Connection = require('../config/connection');


class Voter {
    constructor(connection) {
      if(connection === undefined) {
        this.connection = new Connection();
      }
      else {
        this.connection = connection;
      }
    }
   
    generateRandomSalt() {
      return CryptoJS.lib.WordArray.random(128 / 8).toString();
    }
    
    hashPassword(salt, password) {
      return CryptoJS.SHA3(salt + password).toString();
    }
    
    isValidPassword(password, salt, dbHashedPassword) {
      let newHash = this.hashPassword(salt, password);    
      return (newHash.toString() == dbHashedPassword.toString());
    }

    // If the user's UUID is found, and if their entered password matches what is
    // stored, then return the id of the user. Otherwise return -1.
    async verifyPassword(uuid, password) {
        // First, find the user with the given email address and get their id
        let query = 'SELECT id FROM users WHERE email=?';
        let args = [email];
        let rows = await this.connection.query(query, args);

        // If no such uuid exists, return an empty array
        if(rows.length === 0) {
          return {user_id: -1, agent_id: null, display_name: ""};
        }

        let id = rows[0].id;
        query = 'SELECT salt, password, agent_id, display_name FROM users WHERE id=?';
        args = [id];
        rows = await this.connection.query(query, args);

        // Retrieve the salt and hashed password from the database
        let salt = rows[0].salt;
        let dbHashedPassword = rows[0].password;

        // Now with that salt, hash the new password.
        let hashedPassword = this.hashPassword(salt, password);
        
        // Does the hashed password from the database match the new password? If so, it's the same password.
        if (hashedPassword.toString() === dbHashedPassword.toString()) {
          let agent_id = (rows[0].agent_id == "null") ? null : rows[0].agent_id;
          return {user_id: id, agent_id: agent_id, display_name: rows[0].display_name};
        } else {
          return {user_id: -1, agent_id: null, display_name: ""};
        }
    }

    create(voterInfo) {
        let query = 'INSERT INTO users (name, address_line1, address_line2, postal_code, city, province, district, UUID, salt, password, hasVoted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        let salt = this.generateRandomSalt();
        let hashedPassword = this.hashPassword(salt, voterInfo.password);

        let args = [
            voterInfo,name,
            voterInfo.address_line1,
            voterInfo.address_line2,
            voterInfo.postal_code,
            voterInfo.city,
            voterInfo.province,
            voterInfo.district,
            voterInfo.UUID,
            salt,
            hashedPassword,
            voterInfo.hasVoted
        ];
        await this.connection.query(query, args);

        return await this.getLastUserCreated();
    }

    async getLastUserCreated() {
        let query = 'SELECT MAX(id) as id FROM users';
        let rows = await this.connection.query(query);
        const user_id = rows[0].id;
        rows = await this.getUserWithId(user_id);
        return rows[0];
    }

    async close() {
        await this.connection.close();
    }
    
}

module.exports = Voter;

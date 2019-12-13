let Connection = require("../config/connection");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partySchema = new Schema({
  _id: [Schema.Types.ObjectId],
  id: { type: Number },
  party_name: { type: String },
  party_short_name: { type: String },
  party_logo: { type: String },
  party_website: { type: String }
});
const Party = mongoose.model("Party", partySchema);

module.exports = Party;

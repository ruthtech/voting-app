const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  _id: [Schema.Types.ObjectId],
  district_no: { type: Number },
  district_name: { type: String },
  district_name_french: { type: String },
  party_affiliation: { type: String },
  party_affiliation_french: { type: String },
  last_name: { type: String },
  first_name: { type: String },
  middle_initial: { type: String },
  votes_for: { type: String }
});
const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;

const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
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
const candidate = mongoose.model("candidate", candidateSchema);

module.exports = candidate;

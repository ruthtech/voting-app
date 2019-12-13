let Connection = require("../config/connection");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  _id: [Schema.Types.ObjectId],
  district_no: { type: Number },
  district_name: { type: String },
  district_name_french: { type: String },
  population: { type: Number }
});
const District = mongoose.model("District", districtSchema);

module.exports = District;

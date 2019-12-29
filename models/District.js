const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  _id: [Schema.Types.ObjectId],
  district_no: { type: Number },
  district_name: { type: String },
  district_name_french: { type: String },
  population: { type: Number }
});
const DistrictModel = mongoose.model("DistrictModel", districtSchema, "district"); // model name, schema, collection name

module.exports = DistrictModel;

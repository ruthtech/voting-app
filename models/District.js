const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const districtSchema = new Schema({
  _id: Schema.Types.ObjectId,
  district_no: { type: Number },
  district_name: { type: String },
  parties: { type: [[String]] },
  seat: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    districtBoundaries: { 
      type: {
        type: String,
        enum: ['MultiPolygon'],
        required: true
      },
      coordinates: {
        type: [[[[Number]]]],
        required: true
      }
    }
  }
});
const DistrictModel = mongoose.model("DistrictModel", districtSchema, "district"); // model name, schema, collection name

module.exports = DistrictModel;

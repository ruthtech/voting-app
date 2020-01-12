const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const voterSchema = new Schema({
  _id: [Schema.Types.ObjectId],
  isAdmin: { type: Boolean, default: false },
  name: {
    title: { type: String },
    first: { type: String },
    last: { type: String }
  },
  location: {
    street: {
      number: { type: Number },
      name: { type: String }
    },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postcode: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    },
  },
  login: {
    username: { type: String },
    password: { type: String },
  },
  hasvoted: { type: Boolean }
});

let VoterModel = mongoose.model("VoterModel", voterSchema, "voter"); // model name, schema, collection name
module.exports = VoterModel;

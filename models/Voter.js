const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const voterSchema = new Schema({
  _id: [Schema.Types.ObjectId],
  gender: {
    type: String,
    trim: true
  },
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
    timezone: {
      offset: { type: Number },
      description: { type: String }
    }
  },
  email: { type: String },
  login: {
    uuid: { type: String },
    username: { type: String },
    password: { type: String },
    salt: { type: String },
    md5: { type: String },
    sha1: { type: String },
    sha256: { type: String }
  },
  dob: {
    date: { type: Date },
    age: { type: Number }
  },
  registered: {
    date: { type: Date },
    age: { type: Number }
  },
  phone: { type: String },
  cell: { type: String },
  idtype: {
    name: { type: String },
    value: { type: String }
  },
  picture: {
    large: { type: String },
    medium: { type: String },
    thumbnail: { type: String }
  },
  nat: { type: String },
  hasvoted: { type: String }
});

let VoterModel = mongoose.model("VoterModel", voterSchema, "voter"); // model name, schema, collection name
module.exports = VoterModel;

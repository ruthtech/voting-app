let CryptoJS = require("crypto-js");
let db = require("../config/connection");

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
    postcode: {
      type: String,
      validate: [
        ({ length }) => (length = 7),
        "Password must be 7 characters including a space between e.g. X9X 9X9."
      ]
    },
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
  id: {
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

module.exports = mongoose.model("Voter", voterSchema);

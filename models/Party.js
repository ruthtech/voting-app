const mongoose = require("./mongoose_connection");
const Schema = mongoose.Schema;

const partySchema = new Schema({
  _id: [Schema.Types.ObjectId],
  party_id: { type: Number },
  party_name: { type: String },
  party_short_name: { type: String },
  party_logo: { type: String },
  party_website: { type: String }
});
const PartyModel = mongoose.model("PartyModel", partySchema, "party"); // model name, schema, collection name

module.exports = PartyModel;

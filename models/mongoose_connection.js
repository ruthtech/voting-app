const mongoose = require('mongoose');

let databaseUrl = "voting";
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${databaseUrl}`, { useNewUrlParser: true,  useUnifiedTopology: true,   useFindAndModify: false});
const log = require('loglevel');
require('dotenv').config();

if(process.env.LOGGING_LEVEL === 'debug') {
  mongoose.set('debug', true);
}


module.exports = mongoose;

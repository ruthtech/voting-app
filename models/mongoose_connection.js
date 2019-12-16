const mongoose = require('mongoose');

let databaseUrl = "voting";
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${databaseUrl}`, { useNewUrlParser: true,  useUnifiedTopology: true});

module.exports = mongoose;

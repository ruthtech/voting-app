const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const apiRoutes = require(path.join(__dirname, 'controllers', 'apiroutes'));


app.listen(port, () => console.log(`Listening on port ${port}`));

// Routes for data from MySQL
app.use(apiRoutes);
// end Routes for data from MySQL

// Serve the React components and assets
app.use(express.static(path.join(__dirname, 'client/build'))); 

// Since this will match every path that isn't explicitly listed above,
// make sure that this is listed after the data api routes/endpoints.
app.get('*', (req, res) => {  
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
})
// End Serve the React components and assets

// Close your database connection when Node exits
process.on('exit', async function (code) {
  return console.log(`About to exit with code ${code}`);
});

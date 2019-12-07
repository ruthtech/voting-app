const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const apiRoutes = require(path.join(__dirname, 'controllers', 'apiroutes'));


app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, 'client/build'))); 

app.get('/', (req, res) => {  
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

// Routes
app.use(apiRoutes);

// Close your database connection when Node exits
process.on('exit', async function (code) {
  return console.log(`About to exit with code ${code}`);
});

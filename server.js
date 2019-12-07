const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, 'client/build'))); 

app.get('/', (req, res) => {  
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

// create a GET route
app.get('/express_backend', (req, res) => {
  axios.get("https://api.adviceslip.com/advice")
  .then( 
    //res => message = res.data.slip.advice
    res2 => {
      // console.log(res2.data)
      res.send(res2.data);
    }
  )
  .catch(err => console.log(err));
});

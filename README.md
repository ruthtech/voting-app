# Voting Application
Enable eligible voters to vote online and view election results. 

## Getting Started
All of the files can be loaded with your browser. Copy the files to your local directory and open localhost:5000.

### Prerequisites
A browser. Chrome was used for testing. 

### Installing
1. Go to https://github.com/ruthtech/voting-app and click on the "Clone or Download" button. 
2. Choose "Download ZIP". 
3. Unzip into a directory. If you're on Windows, open File Explorer and navigate to the download directory. Select the ZIP file, right click, and choose "Extract All". Accept the default location.
4. Once the file is unzipped, navigate to voting-app-master and use your browser to open index.html.


## Running the tests

Manual tests were run as documented below.

### Invalid Input Tested
1. Wrong password entered
2. Wrong userid entered

### Function Tests
1. Can user log in?
2. Can user edit their address and see the map update?
3. Can user vote? 
4. Can user view candidates for their district?


Navigate to https://arcane-mountain-21933.herokuapp.com/ and log in with userid "happyfrog374" and password "technics".

Our Figma board shows the plan that we had to execute.
![./demo/figma.gif](./demo/figma.gif)

Our Trello board shows our Kanban
![./demo/trello.jpg](./demo/trello.jpg)


## Deployment
View this application on Heroku.  https://arcane-mountain-21933.herokuapp.com/ Log in with userid "happyfrog374" and password "technics".

## Built With
Development Tools:
  * [Visual Studio Code](https://code.visualstudio.com/docs/setup/setup-overview)
  * [Visual Studio Code Extension "Open in Browser"] 
    * Open VS Code.
    * Open the extensions pane and search for open in browser.
    * Select the version written by TechER and click Install.
  * [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
  * [Studio 3T](https://studio3t.com/)
  * [Figma](https://www.figma.com)
  * [Trello](https://trello.com/)

Front end:
  * [Bootstrap](https://getbootstrap.com)
  * [React-Bootstrap](https://react-bootstrap.github.io/)
  * [React](https://reactjs.org/)
  * [Create-React-App](https://github.com/facebook/create-react-app)
  * [mapbox](https://www.mapbox.com/)

Back end:
  * [MongoDB](https://www.mongodb.com/)
  * [Mongoose](https://www.npmjs.com/package/mongoose)
  <!-- * [dotenv](https://www.npmjs.com/package/dotenv) -->
  * [axios](https://www.npmjs.com/package/axios)
  * [express](https://www.npmjs.com/package/express)


## Contributing
This project is not open to contributions.

## Versioning
This project does not use versions at this time. 

## Authors
* Kevin O Davis [https://github.com/kevin-on-davis]
   * Investigation into opennorth to find the information about political candidates (https://represent.opennorth.ca)
   * Investigation into randomuser.me to generate information for population of database (https://randomuser.me/)
   * Database/Mongoose: 
      * creation of MongoDB database and collections
      * initialization of MongoDB from random.me data
      * creation of the Mongoose models
   * Server: 
      * endpoint implementations: verify voter, enter vote, find candidates, run simulation


* Ruth Lee [https://github.com/ruthtech]
   * mapbox (https://www.mapbox.com/)
   * React Front end (React, Bootstrap, React-Bootstrap, create-react-app)
   * Server: 
       * created express server skeleton for Kevin to change the api routes to be populated from the database rather than the mock data. 
       * endpoint implementations: update address in MongoDB, added district information to verify voter, calculated latitude and longitude and added to user
   * Database/Mongoose:
       * Assisted Kevin debugging and modifying the connection to MongoDB/Mongoose model for Heroku
   * Deployment to Heroku

## License
MIT

## Acknowledgments
Thanks to the following:
* [U of T Coding Bootcamp] https://bootcamp.learn.utoronto.ca/coding/
* Icon of Canada flag (circle) made by [Roundicons](https://www.flaticon.com/authors/roundicons) from [Flaticon](https://www.flaticon.com/)
* Canada flag on the login page made by [Freepik](https://www.flaticon.com/authors/freepik) from [Flaticon](https://www.flaticon.com)


  

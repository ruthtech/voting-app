import React, { useState } from 'react';
import Login from "./components/Login";
import Landing from "./components/Landing";
import UserContext from './utils/UserContext';
import log from 'loglevel';
import remote from 'loglevel-plugin-remote';

require('dotenv').config();

// import LoadingSpinner from './components/LoadingSpinner';

// When debugging the React code, set the user data as though they logged in via Login.
// When not debugging, comment out the below import.
//import hannahWhite from './debugReact'; 

const level = (process.env.LOGGING_LEVEL) ? process.env.LOGGING_LEVEL : 'info';
console.log("in App.js process.env.LOGGING_LEVEL is ", process.env.LOGGING_LEVEL);
log.setLevel(level);
const customJSON = log => ({
  msg: log.message,
  level: level,
  stacktrace: log.stacktrace
});

remote.apply(log, { format: customJSON, url: '/logger' });

function App() {
  const [user, setUser] = useState( null );
  // FOR DEBUGGING REACT. Comment out and replace with the line above when in production.
  //const [user, setUser] = useState(hannahWhite); 
  // END DEBUGGING REACT

  // This React application was designed to have only two roots:
  //   1. Login 
  //   2. Landing (after user has logged in)
  //
  // You cannot reach any of the components via a Router. This was done
  // so that we do not need to check, in every component, if the user has logged
  // in or not. The URL cannot reach any components except Login or Landing. 
  let component = null;
  if(user != null) {
    component = <Landing />
  } else {
    component = <Login log={log}/>
  }

  return (
    <UserContext.Provider value={ {
      user: user,
      handleLogin: (newUser) => {
        const userSubset = {
          name: newUser._doc.name,
          district: newUser._doc.location.district,
          street: newUser._doc.location.street,
          city: newUser._doc.location.city,
          postcode: newUser._doc.location.postcode,
          username: newUser._doc.login.username
        }
        console.log("App Context ", JSON.stringify(userSubset)); // Ironically, debugging the logging
        log.info("App Context ", JSON.stringify(userSubset)); 
        setUser(newUser)
      },
      log: log
    } }>
      { component }
    </UserContext.Provider>
  );
}

export default App;
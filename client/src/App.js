import React, { useState } from 'react';
import Login from "./components/Login";
import Landing from "./components/Landing";
import UserContext from './utils/UserContext';
import log from 'loglevel';
import remote from 'loglevel-plugin-remote';
import Simulation from './components/Simulation';

// When debugging the React code, set the user data as though they logged in via Login.
// When not debugging, comment out the below import.
//import hannahWhite from './debugReact'; 

const level = (process.env.REACT_APP_LOGGING_LEVEL) ? process.env.REACT_APP_LOGGING_LEVEL : 'info';
log.setLevel(level);
log.info("App mapbox access token is ", process.env.REACT_APP_MAPBOX_API_TOKEN);
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

  // This React application was designed to have only three roots:
  //   1. Login 
  //   2. Landing (after user has logged in)
  //   3. Simulation (after admin has logged in)
  //
  // You cannot reach any of the components via a Router. This was done
  // so that we do not need to check, in every component, if the user has logged
  // in or not. The URL cannot reach any components except Login, Landing, or Simulation. 
  let component = null;
  if(user === null) {
    component = <Login log={log}/>
  } else if(user.isAdmin === true) {
    component = <Simulation />
  } else {
    component = <Landing />
  }

  return (
    <UserContext.Provider value={ {
      user: user,
      handleLogin: (newUser) => {
        if((newUser === null)) {
          // If null, either the username or the password didn't match. No one is logged in yet.
          return;
        }

        if(!newUser.isAdmin) {
          // If the user is an administrator, they don't have an address etc. They just need to run the simulation.
          const userSubset = {
            name: newUser.name,
            district: newUser.location.district,
            street: newUser.location.street,
            city: newUser.location.city,
            postcode: newUser.location.postcode,
            username: newUser.login.username
          }
          log.info("App Context ", JSON.stringify(userSubset)); 
        }
        setUser(newUser)
      },
      log: log
    } }>
      { component }
    </UserContext.Provider>
  );
}

export default App;
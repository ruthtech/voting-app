import React, { useState } from 'react';
import Login from "./components/Login";
import Landing from "./components/Landing";
import UserContext from './utils/UserContext';
// import LoadingSpinner from './components/LoadingSpinner';

// When debugging the React code, set the user data as though they logged in via Login.
// When not debugging, comment out the below import.
//import hannahWhite from './debugReact'; 

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
    component = <Login />
  }

  return (
    <UserContext.Provider value={ {
      user: user,
      handleLogin: (newUser) => {console.log("App Context ", newUser); setUser(newUser)}
    } }>
      { component }
    </UserContext.Provider>
  );
}

export default App;
import React, { useState } from 'react';
import Login from "./components/Login";
import Landing from "./components/Landing";
import UserContext from './utils/UserContext';
import "./App.css";

function App() {
  const [user, setUser] = useState( null );
//  const [user, setUser] = useState( { name: "A. Smith", uuid: 1, district: "W01"});

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
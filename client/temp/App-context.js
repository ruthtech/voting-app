import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "../src/components/Login";
import Landing from "../src/components/Landing";
import EditDistrict from "../src/components/EditDistrict";
import EditDistrictConfirm from "../src/components/EditDistrictConfirm";
import ViewCandidates from "../src/components/ViewCandidates";
import Candidate from "../src/components/Candidate";
import Vote from "../src/components/Vote";
import VoteConfirm from "../src/components/VoteConfirm";
import VoteSubmitted from "../src/components/VoteSubmitted";
import "./App.css";

function App() {
  const handleLogin = (user) => {
    // set this on the context so that every page has access to the user's information
    console.log(`App handleValidate called with`, user);
    setUser(user);
  };

  const UserContext = React.createContext({
    user: {},
    handleLogin: handleLogin
  });
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={user}>
      <Router>
        <Route exact path="/" render={(props) => <Login {...props} handleLogin={handleLogin} /> } />
        <Route exact path="/landing" component={Landing}/>
        <Route exact path="/editdistrict" component={EditDistrict}/>
        <Route exact path="/editdistrictconf" component={EditDistrictConfirm}/>
        <Route exact path="/viewcandidates" component={ViewCandidates}/>
        <Route path="/candidate" component={Candidate}/>
        <Route path="/vote" component={Vote} />
        <Route path="/voteconfirm" component={VoteConfirm} />
        <Route path="/votesubmitted" component={VoteSubmitted} />
      </Router>
    </UserContext.Provider>
  );
}

export default App;

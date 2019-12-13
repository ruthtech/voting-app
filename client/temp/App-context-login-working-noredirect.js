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
import UserContext from '../src/utils/UserContext';
import "./App.css";

function App() {
  const [user, setUser] = useState();

  return (
    <UserContext.Provider value={ {
      user: user,
      handleLogin: (newUser) => {console.log("App Context ", newUser); setUser(newUser)}
    } }>
      <div className="full-screen">
        <Router>
            <Route exact path="/" component={Login} />
            <Route exact path="/landing" render={(props) => <Landing {...props} user={user}/>}/>
            <Route exact path="/editdistrict" render={(props) => <EditDistrict {...props} user={user} />}/>
            <Route exact path="/editdistrictconf" render={(props) => <EditDistrictConfirm {...props}  user={user}/>}/>
            <Route exact path="/viewcandidates" render={(props) => <ViewCandidates {...props}  user={user} />}/>
            <Route path="/candidate" render={(props) => <Candidate {...props}  user={user} />}/>
            <Route path="/vote" render={(props) => <Vote {...props} user={user} />} />
            <Route path="/voteconfirm" render={(props) => <VoteConfirm {...props} user={user} />} />
            <Route path="/votesubmitted" render={(props) => <VoteSubmitted {...props} user={user} />}  />
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
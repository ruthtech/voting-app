import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import EditDistrict from "./components/EditDistrict";
import EditDistrictConfirm from "./components/EditDistrictConfirm";
import ViewCandidates from "./components/ViewCandidates";
import Candidate from "./components/Candidate";
import Vote from "./components/Vote";
import VoteConfirm from "./components/VoteConfirm";
import VoteSubmitted from "./components/VoteSubmitted";
import "./App.css";

function App() {
  // const UserContext = React.createContext();

  const handleValidate = () => {
    // set this on the context so that every page has access to the user's information
  };

  return (
    <div className="full-screen">
        <Router>
          <div className="full-screen">
            <Route exact path="/" render={(props) => <Login {...props} handleValidate={handleValidate} /> } />
            <Route exact path="/landing" component={Landing} />
            <Route exact path="/editdistrict" component={EditDistrict} />
            <Route exact path="/editdistrictconf" component={EditDistrictConfirm} />
            <Route exact path="/viewcandidates" component={ViewCandidates} />
            <Route path="/candidate" render={(props) => <Candidate {...props} />}/>
            <Route path="/vote" render={(props) => <Vote {...props} />} />
            <Route path="/voteconfirm" render={(props) => <VoteConfirm {...props} />} />
            <Route path="/votesubmitted" render={(props) => <VoteSubmitted {...props} />}  />
          </div>
        </Router>
      </div>
  );
}

export default App;

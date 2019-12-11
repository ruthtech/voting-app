// import React, { useState, useEffect } from 'react';
import React from "react";
// import axios from 'axios';
import "./App.css";
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
// import Seed from "./components/seed.js";

function App() {
  // const UserContext = React.createContext();

  const handleLogin = () => {

  };

  const handleLogout = () => {

  };

  return (
    <div class="full-screen">
        {/* <Seed /> */}
        <Router>
          <div class="full-screen">
            <Route exact path="/" component={Login} />
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
// async function fetchAdvice() {
//   try {
//     let response = await axios.get("/api/test");
//     // console.log(response);
//     setTest(response.data.message);
//   } catch (err) {
//     console.log(err);
//   }
// }

export default App;

// function App() {
//   const [test, setTest] = useState("default");

//   async function fetchAdvice() {
//     try {
//       let response = await axios.get('/api/test');
//       // console.log(response);
//       setTest(response.data.message);
//     } catch ( err ) {
//       console.log(err);
//     }
//   }

//   useEffect(() => {
//     // called setState only to trigger this method
//     fetchAdvice();
//   }, []);

//   return (
//     <div className="App">
//         <p>
//           Test is: {test}
//         </p>
//         <p>
//           This is another test.
//         </p>
//     </div>
//     <Login />
//   );
// }

// export default App;

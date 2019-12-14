import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import VoteRow from './VoteRow';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import VoteConfirm from './VoteConfirm';
import LoadingSpinner from './LoadingSpinner';

import "./style.css";



function Vote() {
  const [candidates, setCandidates] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 for the loading spinner, 1 for the page listing all of the voting rows, and 2 for vote confirm
  const [voter, setVoter] = useState(null);

  useEffect( () => {
    console.log("Vote useEffect");
    async function loadCandidates() {
      try {
        if(voter === null) {
          // Not ready to load candidates until we know what district the user is in
          console.log("Vote loadCandidates no voter yet");
          return;
        }
  
        if(activeComponentId === 0) {
          console.log("Vote loadCandidates voter is ", voter);
          const candidates = await axios.get(`/api/candidates/${voter.district}`);
          console.log("Vote loadCandidates after ", candidates);
          setCandidates(candidates.data);
          setActiveComponentId(1);
        }
      }
      catch( err ) {
          console.log(err);
//          setCandidates([]);
          let mockCandidates = [
            { name: "A. Scheer", pictureURL: "/candidate-pc-photo.jpg", party: "Conservative Party of Canada", district: "W01", id:"1234", phone: "1-800-100-1000", address: "1 Anywhere St", email: "scheer@pc.ca", twitter: "@scheer-pc", website: "http://scheer.pc.ca", party_website: "http://www.conservative.ca" },
            { name: "E. May", pictureURL: "/candidate-pc-photo.jpg", party: "Green Party of Canada", district: "W01", id:"2345", phone: "1-800-200-2000", address: "2 Anywhere St", email: "may@green.ca", twitter: "@may-green", website: "http://may.green.ca", party_website: "http://greenparty.ca" },
            { name: "J. Singh", pictureURL: "/candidate-pc-photo.jpg", party: "New Democrat Party", district: "W01", id:"3456", phone: "1-800-300-3000", address: "3 Anywhere St", email: "singh@ndp.ca", twitter: "@singh-ndp", website: "http://singh.ndp.ca", party_website: "http://www.ndp.ca" },
            { name: "Y. Blanchet", pictureURL: "/candidate-pc-photo.jpg", party: "Bloc Quebecois", district: "W01", id:"4567", phone: "1-800-400-41000", address: "4 Anywhere St", email: "blanchet@blocquebecois.org", twitter: "@blanchet-bloc", website: "http://blanchet.blocquebecois.org", party_website: "http://blocquebecois.org" },
            { name: "J. Trudeau", pictureURL: "/candidate-pc-photo.jpg", party: "Liberal Party of Canada", district: "W01", id:"5678", phone: "1-800-500-5000", address: "5 Anywhere St", email: "trudeau@liberal.ca", twitter: "@trudeau-liberal", website: "http://trudeau.liberal.ca", party_website: "http://www.liberal.ca" },
          ];
          setCandidates(mockCandidates); // FOR TESTING ONLY
          setActiveComponentId(1); // FOR TESTING ONLY

      }
    };
    loadCandidates();  
  }, [voter]);


  const handleFormSelect = async (candidate) => {
    console.log("Vote, candidate selected, candidate is ", candidate);
    setSelectedCandidate(candidate);
  };

  // Active Component Id 0
  const renderLoading = () => {
    return <LoadingSpinner />;
  };

  // Active Component Id 1
  const renderDefault = () => {
    console.log("Vote renderDefault ", candidates);
    return  (
      <div className="container bg-grey full-screen">
        <div className="row pt-3">
          <div className="col">
            <h1>Vote in District {voter.district}</h1>
          </div>
        </div>
        <div className="row pt-3 pb-3">
            <div className="col">
                <VoteRow
                  model={candidates}
                  handleFormSelect={handleFormSelect}
                />
            </div>
        </div>
        <div className="row bottom">
            <div className="col right-align-div">
              <Button variant="secondary" type="submit" onClick={
                () => { setActiveComponentId(2) }}>
                Vote
              </Button>
            </div>
        </div>
    </div>
    );
  };

  // Active Component Id 2
  const renderVoteConfirm = () => {
    return <VoteConfirm candidate={selectedCandidate} />
  };

  const renderActiveComponent = () => {
    switch(activeComponentId) {
      case(0): {
        return renderLoading();
      }

      case(2): {
        return renderVoteConfirm();
      }

      case(2):
      default: {
        return renderDefault();
      }
    }
  };

  return (
    <UserContext.Consumer>
    {
      ({user}) => {
        // console.log("Vote in render. user is ", user);
        setVoter(user);
        // console.log("Vote in render. voter is ", voter);
        // console.log("Vote in render. candidates are ", candidates);
        // console.log("Vote in render, loading is ", loading);
        return renderActiveComponent();
      }
    }
    </UserContext.Consumer>
  );
}

export default Vote;

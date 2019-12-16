import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import VoteRow from './VoteRow';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import VoteConfirm from './VoteConfirm';
import LoadingSpinner from './LoadingSpinner';

import "./style.css";



function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 for the loading spinner, 1 for the page listing all of the voting rows, and 2 for vote confirm
  const [voter, setVoter] = useState(null);

  useEffect( () => {
    // console.log("Vote useEffect");
    async function loadCandidates() {
      try {
        if(voter === null) {
          // Not ready to load candidates until we know what district the user is in
          // console.log("Vote loadCandidates no voter yet");
          return;
        }
  
        if(activeComponentId === 0) {
          // console.log("Vote loadCandidates voter is ", voter);
          console.log(voter._doc);
          let postcode = voter._doc.location.postcode.replace(/\s/g, "");
          console.log(`Vote loadCandidates with /api/candidates/${postcode}`);
          const candidates = await axios.get(`/api/candidates/${postcode}`);
          console.log("Vote loadCandidates after ", candidates.data);
          setCandidates(candidates.data.candidateList);
          setActiveComponentId(2);
        }
      }
      catch( err ) {
          console.log(err);
          setCandidates([]);
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
    // console.log("Vote renderDefault ", candidates);
    return  (
      <div className="container-fluid bg-grey full-screen">
        <div className="row pt-3">
          <div className="col">
            <h1>Vote in District {voter._doc.location.district}</h1>
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
              <Button variant="secondary w-50" type="submit" onClick={
                () => { setActiveComponentId(1) }} disabled={selectedCandidate===null}>
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

      case(1): {
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

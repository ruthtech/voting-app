import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import VoteRow from './VoteRow';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import VoteConfirm from './VoteConfirm';
import LoadingSpinner from './LoadingSpinner';
import Landing from './Landing';

// When debugging the React code, set the user data as though they logged in via Login.
// When not debugging, comment out the below import.
// import { ottawaCentreCandidatesList } from '../debugReact'; 

import "./style.css";


function Vote(props) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 for the loading spinner, 1 for the page listing all of the voting rows, 2 for vote confirm, and 3 for landing
  const [voter, setVoter] = useState(null);

  useEffect( () => {
    async function loadCandidates() {
      try {
        if(voter === null) {
          // Not ready to load candidates until we know what district the user is in
          return;
        }
  
        if(activeComponentId === 0) {
          props.log.debug(voter._doc);
          let postcode = voter._doc.location.postcode.replace(/\s/g, "");
          props.log.debug(`Vote loadCandidates with /api/candidates/${postcode}`);
          const candidates = await axios.get(`/api/candidates/${postcode}`);
          props.log.debug("Vote loadCandidates after ", candidates.data);
          setCandidates(candidates.data.candidateList);

          // FOR DEBUGGING REACT. Comment out and replace with the line above when in production.
          // setCandidates(ottawaCentreCandidatesList);
          // END DEBUGGING REACT
          setActiveComponentId(2);
        }
      }
      catch( err ) {
          props.log.error(err);
          setCandidates([]);
      }
    };
    loadCandidates();  
  }, [voter]);


  const handleFormSelect = async (candidate) => {
    props.log.debug("Vote, candidate selected, candidate is ", candidate);
    setSelectedCandidate(candidate);
  };

  // Active Component Id 0
  const renderLoading = () => {
    return <LoadingSpinner />;
  };

  // Active Component Id 1
  const renderDefault = () => {
    return  (
      <div className="container-fluid bg-almostWhite full-screen">
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
        <div className="row">
          <div className="col">
            <Button variant="secondary w-100" type="submit" onClick={
              () => { setActiveComponentId(3) }} >
              Home
            </Button>
          </div>
          <div className="col">
            <Button variant="secondary w-100" type="submit" onClick={
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
    return <VoteConfirm candidate={selectedCandidate} log={props.log} voterId={voter._doc.login.uuid}/>
  };

  // Active Component Id 3
  const renderHome = () => {
    return <Landing />;
  };

  const renderActiveComponent = () => {
    switch(activeComponentId) {
      case(0): {
        return renderLoading();
      }

      case(1): {
        return renderVoteConfirm();
      }

      case(3): {
        return renderHome();
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
        setVoter(user);
        return renderActiveComponent();
      }
    }
    </UserContext.Consumer>
  );
}

export default Vote;

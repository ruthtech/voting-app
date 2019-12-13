import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import VoteRow from './VoteRow';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import VoteConfirm from './VoteConfirm';
import LoadingSpinner from './LoadingSpinner';

import "./style.css";

function Vote() {
  const [candidates, setCandidates] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
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
  
        if(loading) {
          console.log("Vote loadCandidates voter is ", voter);
          const candidates = await axios.get(`/api/candidates/${voter.district}`);
          console.log("Vote loadCandidates after ", candidates);
          setCandidates(candidates.data);
          setLoading(false);
        }
      }
      catch( err ) {
          console.log(err);
          setCandidates([]);
      }
    };
    loadCandidates();  
  }, [voter]);


  const handleFormSelect = async (event) => {
    setSelectedCandidate(event.target.value);
  }

  const renderVoteConfirm = () => {
    return <VoteConfirm 
              candidate={selectedCandidate}
              />
  }

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
                () => { renderVoteConfirm() }
                // props.history.push({
                //   pathname: "/voteconfirm",
                //   candidate: {selectedCandidate}
                // })
              }>
                Vote
              </Button>
            </div>
        </div>
    </div>
    );
  }

  return (
    <UserContext.Consumer>
    {
      ({user}) => {
        console.log("Vote in render. user is ", user);
        setVoter(user);
        console.log("Vote in render. voter is ", voter);
        console.log("Vote in render. candidates are ", candidates);
        console.log("Vote in render, loading is ", loading);
        return loading ? <LoadingSpinner /> : renderDefault();
      }
      
  }
  </UserContext.Consumer>
    );
}

export default Vote;

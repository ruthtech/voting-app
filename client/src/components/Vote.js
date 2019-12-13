import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
import VoteRow from './VoteRow';
import axios from 'axios';
import "./style.css";

function Vote(props) {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState();

  useEffect(() => {
    loadCandidates(props.user.district);
  }, []);

  const loadCandidates = async (district) => {
    try {
      const candidates = await axios.get(`/candidates?district=${district}`);
      console.log(candidates);
      setCandidates(candidates.data);
    }
    catch( err ) {
        console.log(err);
        setCandidates([]);
    }
  };

  const handleFormSelect = async (event) => {
    setSelectedCandidate(event.target.value);
  }


  return (
    <div className="container bg-grey full-screen">
      <div className="row pt-3">
        <div className="col">
          <h1>Vote in District {props.user.district}</h1>
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
              props.history.push({
                pathname: "/voteconfirm",
                candidate: {selectedCandidate}
              })
            }>
              Vote
            </Button>
          </div>
      </div>
  </div>
    );
}

export default Vote;

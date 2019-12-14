import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Landing from './Landing';
import CandidateDetails from './CandidateDetails';

import "./style.css";

// Props is the array of candidates
function CandidateCard(props) {
  console.log("CandidateCard");
  console.log(props);
  const [selectedCandidate, setSelectedCandidate] = useState(null); 
  const [activeComponentId, setActiveComponentId] = useState(1); // 0 is home, 1 is list of candidates, 2 is selected candidate detail

  const renderHome = () => {
    console.log("CandidateCard going home");
    return (
      <Landing />
    );
  }

  const renderCandidateDetails = (candidate) => {
    return <CandidateDetails candidate={candidate} handleSelectCandidate={setSelectedCandidate}/>
  };

  const renderCandidateThumbnail = (candidate) => {
    return (
      <div key={candidate.id} className="ml-3 mt-3 col-12 col-sm-4">
      <Card className={candidate.party}>         
        <Card.Img variant="top" src={candidate.pictureURL}   />
        <Card.Title>{candidate.name}</Card.Title>
        <Card.Text>
        {candidate.party}
        </Card.Text>
        <button className="btn btn-secondary" 
          onClick={(event) => {
            setSelectedCandidate(candidate);
            setActiveComponentId(2);
          }}>
          View {candidate.name}</button>
      </Card>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeComponentId) {
      case(0): {
        return renderHome();
      }

      case(2): {
        return renderCandidateDetails(selectedCandidate);
      }

      case(1): 
      default: {
        return props.model.map( (candidate) => {
          return renderCandidateThumbnail(candidate);
        });
      }
    }
  }

  return ( 
    renderActiveComponent()
  );

}

export default CandidateCard;

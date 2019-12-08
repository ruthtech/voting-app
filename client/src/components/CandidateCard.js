import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function CandidateCard(props) {
  return props.model.map( (candidate, index) => {
    return (
      <div className="ml-3 mt-3 col-12 col-sm-4">
        <Link to={'/candidate?id='+candidate.id}> 
        <Card key={index} style={{ backgroundColor: candidate.partyColour, color: '#ffffff' }}>         
          <Card.Img variant="top" src={candidate.pictureURL}   />
          <Card.Title>{candidate.name}</Card.Title>
          <Card.Text>
            {candidate.party}
          </Card.Text>
        </Card>
        </Link>
      </div>
    );
  });
}

export default CandidateCard;

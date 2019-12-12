import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import "./style.css";

function CandidateCard(props) {
  console.log("CandidateCard");
  console.log(props);
  
  return props.model.map( (candidate, index) => {
    return (
      <div className="ml-3 mt-3 col-12 col-sm-4">
        <Link to={'/api/candidate/'+candidate.id}> 
        <Card key={index} className={candidate.party}>         
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

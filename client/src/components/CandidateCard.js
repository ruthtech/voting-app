import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import UserContext from '../utils/UserContext';
import "./style.css";

function CandidateCard(props) {
  console.log("CandidateCard");
  console.log(props);
  
  return props.model.map( (candidate, index) => {
    console.log(candidate);
    return (
      <UserContext.Consumer>
      {
      <div className="ml-3 mt-3 col-12 col-sm-4">
        <Link to={{
          pathname: '/candidate/',
          state: {data: candidate}
          }}> 
        <Card key={index} className={candidate.party}>         
          <Card.Img variant="top" src={candidate.pictureURL}   />
          <Card.Title>{candidate.name}</Card.Title>
          <Card.Text>
            {candidate.party}
          </Card.Text>
        </Card>
        </Link>
      </div>
      }
      </UserContext.Consumer>
    );
  });
}

export default CandidateCard;

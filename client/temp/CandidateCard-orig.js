import React from 'react';
import Card from 'react-bootstrap/Card';
// import { Link } from 'react-router-dom';
import UserContext from '../utils/UserContext';
import Candidate from "./Candidate";
import Button from "react-bootstrap/Button";
import "./style.css";

function CandidateCard(props) {
  console.log("CandidateCard");
  console.log(props);

  const renderCard = () => {

  }

  
  
  return props.model.map( (candidate) => {
    console.log(candidate);

    return (
      <UserContext.Consumer>
      {
        ({user}) => {
          return (
            <div key={candidate.id} className="ml-3 mt-3 col-12 col-sm-4 clickable"  
                onClick={ () => {return <Candidate candidate={candidate} />}} >
            {/* <Link to={{
              pathname: '/candidate/',
              state: {data: candidate}
              }}>  */}
            <Card className={candidate.party}>         
              <Card.Img variant="top" src={candidate.pictureURL}   />
              <Card.Title>{candidate.name}</Card.Title>
              <Card.Text>
                {candidate.party}
              </Card.Text>
            </Card>
            {/* </Link> */}
            <Button onClick={ () => {return <Candidate candidate={candidate} />}} >View {candidate.name}</Button>
          </div>
          );
        }
      }
      </UserContext.Consumer>
    );
  });
}

export default CandidateCard;

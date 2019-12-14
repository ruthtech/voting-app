import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Landing from './Landing';
import ViewCandidates from './ViewCandidates';
import "./style.css";

function Candidate(props) {
    console.log("Candidate ", props);
    const [candidate, setCandidate] = useState(props.candidate);
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 is for candidate details, 1 is for list of candidates, 2 is for Landing

    // Active component Id 0
    const renderCandidateDetails = () => {
        return (
            <div className=" container">
                <div className="row">
                    <div className="col text-center">
                        <Image src={candidate.pictureURL} />
                    </div>
                    <div className="col">
                        <h1>{candidate.name}</h1>
                        <h5>{candidate.party}</h5>
                        <h5>{candidate.district}</h5>
                    </div>
                </div>
                <div className="row">
                  <div className="col">
                    <Card className={candidate.party}>
                      <Card.Body>
                        <Card.Title>Contact</Card.Title>
                        <Card.Text>Phone: {candidate.phone}</Card.Text>
                        <Card.Text>Office Address: {candidate.address}</Card.Text>
                        <Card.Text>Email: {candidate.email}</Card.Text>
                        <Card.Text>Twitter: <Card.Link href={candidate.twitter}>{candidate.twitter}</Card.Link></Card.Text>
                        <Card.Text>Website: <Card.Link href={candidate.website}>{candidate.website}</Card.Link></Card.Text>                      
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                <div className="row">
                    <div className="col centre-align-div">
                        <h2><a href={candidate.party_website}>{candidate.party}</a></h2>
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col spread-align-div">
                        <Button variant="secondary" onClick={ () => { setActiveComponentId(1) }}>View Candidates</Button>
                        <Button variant="secondary" onClick={ () => { setActiveComponentId(2) }}>Home</Button>
                    </div>
                </div>
            </div>
        );
    }

    // Active component id 1
    const renderAllCandidates = () => {
        return <ViewCandidates />;
    }

    // Active component id 2
    const renderHome = () => {
        console.log("CandidateDetails going home");
        return (
          <Landing />
        );
    }    

    const renderActiveComponent = () => {
        switch (activeComponentId) {
            case(2): {
              return renderHome();
            }
      
            case(1): {
              return renderAllCandidates();
            }
      
            case(0): 
            default: {
              return renderCandidateDetails();
            }
        }
    }

    return (
        renderActiveComponent()
    );
}

export default Candidate;

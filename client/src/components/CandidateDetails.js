import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Landing from './Landing';
import ViewCandidates from './ViewCandidates';
import "./style.css";

function Candidate(props) {
    // console.log("Candidate ", props);
    const [candidate] = useState(props.candidate);
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 is for candidate details, 1 is for list of candidates, 2 is for Landing

    const getPartyWebsite = (party_affiliation) => {
        switch(party_affiliation) {
            case('Conservative Party of Canada'): {
                return "http://www.conservative.ca";
            }

            case('Green Party of Canada'): {
                return "http://greenparty.ca";
            }

            case('Liberal Party of Canada'): {
                return "http://www.liberal.ca";
            }

            case("New Democratic Party"): {
                return "http://www.ndp.ca";
            }

            case("Bloc Québécois"): {
                return "http://blocquebecois.org";
            }

            default: {
                return "https://www.elections.ca/content.aspx?section=pol&dir=par&document=index&lang=e"; // indicate no party website by directing them to the general Elections Canada web site listing all of them
            }
        }
    }

    // Active component Id 0
    const renderCandidateDetails = () => {
        return (
            <div className="container-fluid full-screen bg-grey">
                <div className="row">
                    {/* <div className="col text-center">
                        <Image src={candidate.pictureURL} />
                    </div> */}
                    <div className="col">
                        <h1>{candidate.first_name} {candidate.last_name}</h1>
                        <h5>{candidate.party_affiliation}</h5>
                        <h5>{candidate.district_name}</h5>
                    </div>
                </div>
                {/* <div className="row">
                  <div className="col">
                    <Card className={candidate.party}>
                      <Card.Body>
                        <Card.Title>Contact</Card.Title>
                        <Card.Text><b>Phone:</b> {candidate.phone}</Card.Text>
                        <Card.Text><b>Office Address:</b> {candidate.address}</Card.Text>
                        <Card.Text><b>Email:</b> {candidate.email}</Card.Text>
                        <Card.Text><b>Twitter:</b> <Card.Link href={candidate.twitter}>{candidate.twitter}</Card.Link></Card.Text>
                        <Card.Text><b>Website:</b> <Card.Link href={candidate.website}>{candidate.website}</Card.Link></Card.Text>                      
                      </Card.Body>
                    </Card>
                  </div>
                </div> */}
                <div className="row">
                    <div className="col centre-align-div">
                        <h4><a href={getPartyWebsite(candidate.party_affiliation)}>{candidate.party_affiliation}</a></h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col centre-align-div">
                        <h4><a href="https://www.elections.ca/content.aspx?section=pol&dir=par&document=index&lang=e">Elections Canada Registered Political Parties</a></h4>
                    </div>
                </div>
                <div className="row p-3">
                    <div className="col">
                        <Button variant="secondary w-100" onClick={ () => { setActiveComponentId(1) }}>View Candidates</Button>
                    </div>
                    <div className="col">
                        <Button variant="secondary w-100" onClick={ () => { setActiveComponentId(2) }}>Home</Button>
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

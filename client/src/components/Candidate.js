import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
// import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import "./style.css";

function Candidate(props) {
    const [candidate, setCandidate] = useState([]);

    useEffect(() => {
        loadCandidateInformation(candidate.id);
    }, []);

    const loadCandidateInformation = (candidateId) => {
        // In production, this will be a call to the server to get the details
        // for a particular candidate
        try {
            const mockCandidate = { 
                name: "Lisa M.", 
                pictureURL: "/candidate-pc-photo.jpg", 
                party: "Conservative Party of Canada", 
                district: "W01", 
                partyColour: "#244982", 
                id:"2345", 
                phone: "1-800-100-1000",
                address: "1 Anywhere St",
                email: "lisam@pc.ca",
                twitter: "@lisam-pc",
                website: "http://lisam.pc.ca",
                party_website: "http://www.pc.ca"
            };
            setCandidate(mockCandidate);
        }
        catch( err ) {
            console.log(err);
            this.setCandidate({});
        }
    }

    return (
        <div className={candidate.party + " container"}>
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
                    {/* <Link to={candidate.party_website} /> */}
                    <h2><a href={candidate.party_website}>Conservative Party of Canada</a></h2>
                </div>
            </div>
            <div className="row p-3">
                <div className="col spread-align-div">
                    <Button variant="secondary">View Candidates</Button>
                    <Button variant="secondary">Home</Button>
                </div>
            </div>
        </div>
    );
}

export default Candidate;

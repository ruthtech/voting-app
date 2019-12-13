import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import "./style.css";

function Candidate(props) {
    const [candidate, setCandidate] = useState([]);

    useEffect(() => {
        console.log(props.location.state.data);
        setCandidate(props.location.state.data);
    }, []);

    return (
        <UserContext.Consumer>
        {  
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
                    <h2><a href={candidate.party_website}>{candidate.party}</a></h2>
                </div>
            </div>
            <div className="row p-3">
                <div className="col spread-align-div">
                    <Button variant="secondary">View Candidates</Button>
                    <Button variant="secondary"
                  onClick={ () => {
                    props.history.push({
                    pathname: "/landing",
                    props: {props}})}}
                >Home
                </Button>
                </div>
            </div>
        </div>
       }
        </UserContext.Consumer>
    );
}

export default Candidate;

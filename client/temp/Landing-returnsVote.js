import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';
import Test from './Test';
import "./style.css";


function Landing() {
    console.log("Landing");
    const [editDistrict, setEditDistrict] = useState(null);
    const [viewCandidates, setViewCandidates] = useState(null);
    const [vote, setVote] = useState(null);
    const [subcomponent, setSubcomponent] = useState(null);

    useEffect(() => {
        console.log("new subcomponent edit district");
        setSubcomponent(<EditDistrict />);
    }, [editDistrict]);

    useEffect(() => {
        console.log("new subcomponent view candidates");
        setSubcomponent(<ViewCandidates />);
    }, [viewCandidates]);

    useEffect(() => {
        console.log("new subcomponent vote");
        setSubcomponent(<Vote />);
    }, [vote]);

    function renderDefault(user) {
        setSubcomponent(
            <div className="container bg-map full-screen">
                <div className="row">
                    <div className="mt-3">
                    <Form className="bg-white">
                        <Form.Group className="between-align-div" controlId="editElectoralDistrict">
                        <Form.Label>Your district is {user.district}</Form.Label>
                        <Button variant="secondary" 
                            onClick={ () => { setEditDistrict(true) }}>
                            Edit</Button>
                        </Form.Group>
                    </Form>                
                    </div>
                </div>
                <div className="row bottom">
                    <div className="col spread-align-div">
                        <Button variant="secondary" 
                            onClick={ () => { setViewCandidates(true) } }>
                            View Candidates</Button>
                        <Button variant="secondary"
                            onClick={ () => { setVote(true) } }>
                            Vote</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
      <UserContext.Consumer>
      {
          ({user}) => {
            if(subcomponent === null) {
              // Can't set this on function load because we need to know 
              // the user's data.
              setSubcomponent(renderDefault(user));
            }
            console.log(subcomponent);
            return subcomponent;
          }
      }
      </UserContext.Consumer>  

    );
}

export default Landing;

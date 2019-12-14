import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';
import LoadingSpinner from './LoadingSpinner';
import "./style.css";


function Landing() {
    console.log("Landing");
    const [voter, setVoter] = useState(null);
    const [subcomponent, setSubcomponent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // console.log("useEffect");
        setSubcomponent(renderDefault());
        // console.log(subcomponent);
    }, [voter]);

    function renderDefault() {
        // console.log("renderDefault");
        if(voter == null) {
            // Not ready to render yet
            // console.log("voter is null, returning");
            return;
        }


        setLoading(false);
        return (
            <div className="container bg-map full-screen">
                <div className="row">
                    <div className="col mt-3 w-100">
                    <Form className="bg-white">
                        <Form.Group className="between-align-div" controlId="editElectoralDistrict">
                        <Form.Label>Your district is {voter.district}</Form.Label>
                        <Button variant="secondary" 
                            onClick={ () => { setSubcomponent(<EditDistrict />) }}>
                            Edit</Button>
                        </Form.Group>
                    </Form>                
                    </div>
                </div>
                <div className="row bottom">
                    <div className="col spread-align-div">
                        <Button variant="secondary" 
                            onClick={ () => { setSubcomponent(<ViewCandidates />) }}>
                            View Candidates</Button>
                        <Button variant="secondary"
                            onClick={ () => { setSubcomponent(<Vote />) } }>
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
            // Can't set this on function load because we need to know 
            // the user's data.
            setVoter(user);
            // console.log(subcomponent);
            return loading ? <LoadingSpinner /> : subcomponent;
          }
      }
      </UserContext.Consumer>  

    );
}

export default Landing;

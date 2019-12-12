import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "./style.css";
import axios from 'axios';

function Landing(props) {
    console.log("Landing");
    console.log(props);

    return (
        <div className="container bg-map full-screen">
            <div className="row">
                <div className="mt-3">
                  <Form className="bg-white">
                    <Form.Group className="between-align-div" controlId="editElectoralDistrict">
                      <Form.Label>Your district is {props.user.district}</Form.Label>
                      <Button variant="secondary" onClick={ () => {
                        props.history.push({
                            pathname: "/editdistrict",
                            user: props.user.data
                        })}}>Edit</Button>
                    </Form.Group>
                  </Form>                
                </div>
            </div>
            <div className="row bottom">
                <div className="col spread-align-div">
                    <Button variant="secondary" onClick={ () => {
                        props.history.push({
                        pathname: "/viewcandidates",
                        district: {details: props.user.data}
                    })}}>View Candidates</Button>
                    <Button variant="secondary">Vote</Button>
                </div>
            </div>
        </div>
    );
}

export default Landing;

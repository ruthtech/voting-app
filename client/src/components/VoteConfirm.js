import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import "./style.css";

function VoteConfirm(props) {

    return (
        <UserContext.Consumer>
        {  
        <div className={props.party + " container full-screen"}>
            <div className="row">
                <div className="col">
                    <h1>You are voting for</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                  <Form>
                    <Form.Group controlId="voteForCandidate">
                      <Form.Label>{props.name}</Form.Label>
                      <Form.Label>{props.party}</Form.Label>
                      <Form.Control as="textarea" rows="3" disabled />
                    </Form.Group>
                  </Form>                
                </div>
            </div>
            <div className="row pt-3">
                <div className="col">
                    <h1>Is this correct?</h1>
                </div>
            </div>
            <div className="row bottom">
                <div className="col spread-align-div">
                    <Button variant="secondary">Edit</Button>
                    <Button variant="secondary">Confirm</Button>
                </div>
            </div>
        </div>
        }
        </UserContext.Consumer>
    );
}

export default VoteConfirm;

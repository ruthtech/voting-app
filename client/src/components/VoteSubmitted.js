import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import './style.css';

function VoteSubmitted(props) {

    return (
        <UserContext.Consumer>
        {  
        <div className={props.party + " container"} >
            <div className="row">
                <div className="col">
                    <h1>You voted for</h1>
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
            <div className="row">
                <div className="col">
                    <h2>Thank you! Your vote has been registered.</h2>
                </div>
            </div>
            <div className="row bottom">
                <div className="col right-align-div">
                    <Button variant="secondary">Home</Button>
                </div>
            </div>
        </div>
        }
        </UserContext.Consumer>
    );
}

export default VoteSubmitted;

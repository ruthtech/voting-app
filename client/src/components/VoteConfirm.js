import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import Vote from "./Vote";
import VoteSubmitted from "./VoteSubmitted";
import "./style.css";

function VoteConfirm(props) {
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 is for default, 1 is for edit/go back, 2 is for save/confirm
    const [candidate] = useState(props.candidate);
    console.log("VoteConfirm candidate is ", candidate);

    // Active Component Id 0
    const renderDefault = () => {
      return (
        <div className={"container-fluid bg-almostWhite full-screen"}>
            <div className="row pb-3">
                <div className="col">
                    <h1>You are voting for</h1>
                </div>
            </div>
            <div className="row pb-3 text-center">
                <div className="col">
                  <Card>
                    <Card.Body>
                      <Card.Title>{candidate.first_name} {candidate.last_name}</Card.Title>
                      <Card.Text>{candidate.party_affiliation}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
            </div>
            <div className="row pt-3">
                <div className="col">
                    <h1>Is this correct?</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Button variant="secondary w-100" onClick={() => {setActiveComponentId(1)}}>Edit</Button>
                </div>
                <div className="col">
                    <Button variant="secondary w-100" onClick={() => {setActiveComponentId(2)}}>Confirm</Button>
                </div>
            </div>
        </div>
      );
    }

    // active component id 1
    const renderEditVote = () => {
        return <Vote />;
    }

    // active component id 2
    const renderConfirm = () => {
        return <VoteSubmitted candidate={candidate}/>;
    }

    const renderActiveComponent = () => {
        switch(activeComponentId) {
            case(1): {
                return renderEditVote();
            }

            case(2): {
                return renderConfirm();
            }

            case(0):
            default: {
                return renderDefault();
            }
        }
    }

    return (
      <UserContext.Consumer>
      {
        ({user}) => renderActiveComponent()
      }
      </UserContext.Consumer>
    );
}

export default VoteConfirm;

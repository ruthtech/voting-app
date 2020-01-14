import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import Landing from "./Landing";
import "./assets/css/style.css";

function VoteSubmitted(props) {
    const [candidate] = useState(props.candidate);
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 means the confirmation message, 1 means landing page

    // active id 1
    const renderHome = () => {
        return <Landing />;
    }

    // active id 0
    const renderDefault = () => {
        return (
            <div className={"container-fluid bg-almostWhite full-screen"} >
                <div className="row">
                    <div className="col">
                        <h1>You voted for</h1>
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
                        <h2>Thank you! Your vote has been registered.</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col right-align-div">
                        <Button variant="secondary w-50" onClick={() => {setActiveComponentId(1)}}>Home</Button>
                    </div>
                </div>
            </div>
        );
    }

    const renderActiveComponent = () => {
        switch(activeComponentId) {
            case(1): {
                return renderHome();
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
          ({user}) => {
            return renderActiveComponent();
          }
        }
        </UserContext.Consumer>
    );
}

export default VoteSubmitted;

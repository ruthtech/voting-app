import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import Landing from "./Landing";
import axios from 'axios';
import './style.css';

function VoteSubmitted(props) {
    const [candidate] = useState(props.candidate);
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 means the confirmation message, 1 means landing page
    console.log("VoteSubmitted props is ", props);
    console.log("VoteSubmitted candidate is ", candidate);

    // Could have done this on the last page (VoteConfirm) ... decisions, decisions ...
    // Tell the server to mark this user as having voted and increment the candidate's # of votes by 1.
    const submitVote = async (user, candidate) => {
      try {
        await axios.put(`/api/vote/${user.uuid}/${candidate.id}`);
      }
      catch( err ) {
        console.log(err);    
      }
    }

    // active id 1
    const renderHome = () => {
        return <Landing />;
    }

    // active id 0
    const renderDefault = () => {
        return (
            <div className={"container-fluid bg-grey full-screen"} >
                <div className="row">
                    <div className="col">
                        <h1>You voted for</h1>
                    </div>
                </div>
                <div className="row pb-3">
                    <div className="col">
                    <Card>
                        <Card.Body>
                        <Card.Title>{candidate.name}</Card.Title>
                        <Card.Text>{candidate.party}</Card.Text>
                        </Card.Body>
                    </Card>
                    </div>
                </div>
                <div className="row pt-3">
                    <div className="col">
                        <h2>Thank you! Your vote has been registered.</h2>
                    </div>
                </div>
                <div className="row bottom">
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
            submitVote(user, candidate);
            return renderActiveComponent();
          }
        }
        </UserContext.Consumer>
    );
}

export default VoteSubmitted;

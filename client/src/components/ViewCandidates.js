import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import LoadingSpinner from './LoadingSpinner';
import Landing from './Landing';
import CandidateDetails from './CandidateDetails';
import Card from 'react-bootstrap/Card';
import "./assets/css/style.css";

function ViewCandidates(props) {
    const [candidates, setCandidates] = useState([]);
    const [voter, setVoter] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null); 
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 for Loading, 1 for Landing, 2 for list of candidates

    useEffect(() => {
      async function loadCandidates() {
        try {
          if(voter === null) {
            // Not ready to load candidates until we know what district the user is in
            return;
          }
  
          if(activeComponentId === 0) {
            let postcode = voter.location.postcode.replace(/\s/g, "");
            const query = `/api/v1/candidates/${postcode}`;
            props.log.debug(query);
            const candidates = await axios.get(query);
            props.log.debug("View Candidates found ", candidates);
            setCandidates(candidates.data.candidateList);
            setActiveComponentId(2);
          }
        }
        catch( err ) {
          props.log.error(err);
          setCandidates([]);
        }
      }
      loadCandidates();
    }, [voter]);

    const loadPartyColour = (candidate) => {
      switch(candidate.party_affiliation) {
        case('New Democratic Party'): {
          return 'ndp'; // the name of the class in the style.css file
        }

        case('Green Party of Canada'): {
          return 'green';
        }

        case('Conservative Party of Canada'): {
          return 'pc';
        }

        case('Liberal Party of Canada'): {
          return 'liberal';
        }

        case('Bloc Qu�b�cois'): {
          return 'bloc';
        }

        default: {
          return 'other';
        }
      }
    }

    const renderDefault = () => {
      return (
        <div className="container-fluid bg-almostWhite">
          <div className="row ">
            {
             candidates.map( (candidate) => {
              props.log.debug(candidate)
               return renderCandidateThumbnail(candidate);
             })
            }
          </div>
          <div className="row mt-3 pb-3">
            <div className="col text-right">
                <Button variant="secondary" onClick={ () => { setActiveComponentId(1) } }>
                Home
                </Button>
            </div>
          </div>
      </div>
      );
    }

    const renderHome = () => {
      return (
        <Landing />
      );
    }
  
    const renderCandidateDetails = (candidate) => {
      return <CandidateDetails candidate={candidate} handleSelectCandidate={setSelectedCandidate} log={props.log}/>
    };
  
    const renderCandidateThumbnail = (candidate) => {
      return (
        <div key={candidate.id} className="col-12 mt-3">
        <Card className={loadPartyColour(candidate)}>         
          {/* <Card.Img variant="top" src={candidate.pictureURL}   /> */}
          <Card.Title>{decodeURI(candidate.first_name)} {decodeURI(candidate.last_name)}</Card.Title>
          <Card.Text>
          {decodeURI(candidate.party_affiliation)}
          </Card.Text>
          <button className="btn btn-secondary" 
            onClick={(event) => {
              setSelectedCandidate(candidate);
              setActiveComponentId(3);
            }}>
            View {candidate.first_name} {candidate.last_name}</button>
        </Card>
        </div>
      );
    }

    const renderActiveComponent = () => {
      switch(activeComponentId) {
        case(0): {
          return <LoadingSpinner />;
        }

        case(1): {
          return renderHome();
        }

        case(3): {
          return renderCandidateDetails(selectedCandidate);
        }

        case(4): {
          return candidates.map( (candidate) => {
            return renderCandidateThumbnail(candidate);
          });
        }

        case(2):
        default: {
          return renderDefault();
        }
      }
    }

    return (
      <UserContext.Consumer>
       {
         ({user}) => {
           setVoter(user);

           return renderActiveComponent();
         }
       }
      </UserContext.Consumer>
    );
}

export default ViewCandidates;

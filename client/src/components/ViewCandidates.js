import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import LoadingSpinner from './LoadingSpinner';
import Landing from './Landing';
import CandidateDetails from './CandidateDetails';
import Card from 'react-bootstrap/Card';
import "./style.css";

function ViewCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [voter, setVoter] = useState(null);
    const [selectedCandidate, setSelectedCandidate] = useState(null); 
    const [activeComponentId, setActiveComponentId] = useState(0); // 0 for Loading, 1 for Landing, 2 for list of candidates
    console.log("viewcandidates");

    useEffect(() => {
      console.log("ViewCandidates useEffect");
      async function loadCandidates() {
        try {
          if(voter === null) {
            // Not ready to load candidates until we know what district the user is in
            console.log("Vote loadCandidates no voter yet");
            return;
          }
  
          if(activeComponentId === 0) {
            console.log(`/api/candidates/${voter.district}`);
            const candidates = await axios.get(`/api/candidates/${voter.district}`);
            console.log("View Candidates found ", candidates);
            setCandidates(candidates.data);
            setActiveComponentId(2);
          }
        }
        catch( err ) {
            console.log(err);
            // setCandidates([]);

            // FOR TESTING ONLY
            let mockCandidates = [
              { name: "A. Scheer", pictureURL: "/candidate-pc-photo.jpg", party: "Conservative Party of Canada", district: "W01", id:"1234", phone: "1-800-100-1000", address: "1 Anywhere St", email: "scheer@pc.ca", twitter: "@scheer-pc", website: "http://scheer.pc.ca", party_website: "http://www.conservative.ca" },
              { name: "E. May", pictureURL: "/candidate-pc-photo.jpg", party: "Green Party of Canada", district: "W01", id:"2345", phone: "1-800-200-2000", address: "2 Anywhere St", email: "may@green.ca", twitter: "@may-green", website: "http://may.green.ca", party_website: "http://greenparty.ca" },
              { name: "J. Singh", pictureURL: "/candidate-pc-photo.jpg", party: "New Democrat Party", district: "W01", id:"3456", phone: "1-800-300-3000", address: "3 Anywhere St", email: "singh@ndp.ca", twitter: "@singh-ndp", website: "http://singh.ndp.ca", party_website: "http://www.ndp.ca" },
              { name: "Y. Blanchet", pictureURL: "/candidate-pc-photo.jpg", party: "Bloc Quebecois", district: "W01", id:"4567", phone: "1-800-400-41000", address: "4 Anywhere St", email: "blanchet@blocquebecois.org", twitter: "@blanchet-bloc", website: "http://blanchet.blocquebecois.org", party_website: "http://blocquebecois.org" },
              { name: "J. Trudeau", pictureURL: "/candidate-pc-photo.jpg", party: "Liberal Party of Canada", district: "W01", id:"5678", phone: "1-800-500-5000", address: "5 Anywhere St", email: "trudeau@liberal.ca", twitter: "@trudeau-liberal", website: "http://trudeau.liberal.ca", party_website: "http://www.liberal.ca" },
            ];
            setCandidates(mockCandidates); // FOR TESTING ONLY
            setActiveComponentId(2); // FOR TESTING ONLY
        }
      }
      loadCandidates();
    }, [voter]);

    const renderDefault = () => {
      return (
        <div className="container-fluid bg-grey">
          <div className="row ">
            {
             candidates.map( (candidate) => {
               console.log(candidate)
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
      console.log("CandidateCard going home");
      return (
        <Landing />
      );
    }
  
    const renderCandidateDetails = (candidate) => {
      return <CandidateDetails candidate={candidate} handleSelectCandidate={setSelectedCandidate}/>
    };
  
    const renderCandidateThumbnail = (candidate) => {
      return (
        <div key={candidate.id} className="col-12 col-sm-4 mt-3">
        <Card className={candidate.party}>         
          <Card.Img variant="top" src={candidate.pictureURL}   />
          <Card.Title>{candidate.name}</Card.Title>
          <Card.Text>
          {candidate.party}
          </Card.Text>
          <button className="btn btn-secondary" 
            onClick={(event) => {
              setSelectedCandidate(candidate);
              setActiveComponentId(3);
            }}>
            View {candidate.name}</button>
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

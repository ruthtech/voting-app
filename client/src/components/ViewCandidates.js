import React, {useState, useEffect} from 'react';
import CandidateCard from './CandidateCard';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import LoadingSpinner from './LoadingSpinner';
import Vote from './Vote';
import "./style.css";

function ViewCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [voter, setVoter] = useState(null);
    const [loading, setLoading] = useState(true);
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
  
          if(loading) {
            console.log(`/api/candidates/${voter.district}`);
            const candidates = await axios.get(`/api/candidates/${voter.district}`);
            console.log("View Candidates found ", candidates);
            setCandidates(candidates.data);
            setLoading(false);
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
            setLoading(false); // FOR TESTING ONLY
        }
      }
      loadCandidates();
    }, [voter]);

    const renderDefault = () => {
      return (
        <div className="container bg-grey" >
          <div className="row">
            <CandidateCard
              model={candidates}
            />
          </div>
          <div className="row p-3">
            <div className="col spread-align-div">
                <Button variant="secondary" onClick={ () => { return <Vote /> } }>
                Home
                </Button>
            </div>
          </div>
      </div>
      );
    }

    return (
      <UserContext.Consumer>
       {
         ({user}) => {
           setVoter(user);

           return loading ? <LoadingSpinner /> : renderDefault();
         }
       }
      </UserContext.Consumer>
    );
}

export default ViewCandidates;

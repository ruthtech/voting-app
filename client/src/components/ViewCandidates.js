import React, {useState, useEffect} from 'react';
import CandidateCard from './CandidateCard';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import "./style.css";

function ViewCandidates(props) {
    const [candidates, setCandidates] = useState([]);
    console.log("viewcandidates");
    console.log(props);

    useEffect(() => {
      console.log("ViewCandidates useEffect");
      loadCandidates(props.user.district);
    }, []);

    const loadCandidates = async (district) => {
        try {
            console.log(`/api/candidates/${district}`);
            const candidates = await axios.get(`/api/candidates/${district}`);
            console.log("View Candidates found ", candidates);
            setCandidates(candidates.data);
        }
        catch( err ) {
            console.log(err);
            setCandidates([]);
        }
    };

    return (
      <UserContext.Consumer>
        {
        <div className="container bg-grey" >
          <div className="row">
            <CandidateCard
              model={candidates}
            />
          </div>
          <div className="row p-3">
            <div className="col spread-align-div">
                <Button variant="secondary"
                  onClick={ () => {
                    props.history.push({
                    pathname: "/landing",
                    props: {props}})}}
                >Home
                </Button>
            </div>
          </div>
        </div>
       }
      </UserContext.Consumer>
    );
}

export default ViewCandidates;

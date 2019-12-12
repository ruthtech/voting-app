import React, {useState, useEffect} from 'react';
import CandidateCard from './CandidateCard';
import axios from 'axios';
import "./style.css";

function ViewCandidates(props) {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
      console.log(props);
        loadCandidates(props.district);
    }, []);

    const loadCandidates = async (district) => {
        try {
            const candidates = await axios.get(`/candidates?district=${district}`);
            console.log(candidates);
            setCandidates(candidates.data);
        }
        catch( err ) {
            console.log(err);
            setCandidates([]);
        }
    };

    return (
        <div className="container bg-grey" >
          <div className="row">
            <CandidateCard
              model={candidates}
            />
          </div>
        </div>
    );
}

export default ViewCandidates;

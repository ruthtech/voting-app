import React, {useState, useEffect} from 'react';
import CandidateCard from './CandidateCard';

function ViewCandidates(prop) {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        loadCandidates(prop.district);
    }, []);

    const loadCandidates = (district) => {
        // In production, this will be a call to the server to get the list
        // of candidates for this district.
        try {
            // const candidates = await axios.get("/viewcandidates?id='W01'");
            // console.log(candidates);
            // this.setCandidates(candidates.data);
            const mockCandidates = [
                { name: "Lisa M.", pictureURL: "/candidate-pc-photo.jpg", party: "Conservative Party of Canada", district: "W01", partyColour: "#244982", id:"2345"},
                { name: "Willie B.", pictureURL: "/candidate-green-photo.jpg", party: "Green Party of Canada", district: "W01", partyColour: "#4e9a2f", id:"1234"}
            ];
            setCandidates(mockCandidates);
        }
        catch( err ) {
            console.log(err);
            this.setCandidates([]);
        }
    };

    return (
        <div className="container" style={{ backgroundColor: '#C4C4C4' }} >
          <div className="row">
            <CandidateCard
              model={candidates}
            />
          </div>
        </div>
    );
}

export default ViewCandidates;

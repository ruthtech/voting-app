import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import VoteRow from './VoteRow';
import "./style.css";

function Vote(props) {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    loadCandidates(props.district);
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
            { name: "Trudeau", pictureURL: "/candidate-pc-photo.jpg", party: "Liberal Party of Canada", district: "W01", partyColour: "#244982", id:"2345"},
            { name: "Parizeau", pictureURL: "/candidate-pc-photo.jpg", party: "Bloc Quebecois", district: "W01", partyColour: "#244982", id:"2345"},
            { name: "Singh", pictureURL: "/candidate-pc-photo.jpg", party: "NDP", district: "W01", partyColour: "#244982", id:"2345"},
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
    <div className="container" style={{ backgroundColor: "#C4C4C4" }}>
      <div className="row pt-3">
        <div className="col">
          <h1>Vote in District {props.district}</h1>
        </div>
      </div>
      <div className="row pt-3 pb-3">
          <div className="col">
              <VoteRow
                model={candidates}
              />
          </div>
      </div>
      <div className="row pb-3">
          <div className="col d-flex justify-content-end">
            <Button variant="secondary" type="submit">
              Vote
            </Button>
          </div>
      </div>
  </div>
    );
}

export default Vote;

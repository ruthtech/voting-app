import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import "./assets/css/style.css";

function VoteRow(props) {
  return props.model.map( (candidate, index) => {
    return (
      <InputGroup key={index} className="pb-3">
        <Form.Control plaintext readOnly className="bg-white text-right pr-3" defaultValue={candidate.last_name + ", " + candidate.first_name + ' / ' + candidate.party_affiliation} />
        <InputGroup.Append>
          <InputGroup.Radio name="votingGroup" aria-label={candidate.last_name + ", " + candidate.first_name + ' / ' + candidate.party_affiliation} onChange={() => props.handleFormSelect(candidate)}/>
        </InputGroup.Append>
      </InputGroup>
    );
  });
}

export default VoteRow;
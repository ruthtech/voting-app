import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
// import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import "./style.css";

function VoteRow(props) {
  return props.model.map( (candidate, index) => {
    return (
      <InputGroup key={index} className="pb-3">
        <Form.Control plaintext readOnly className="bg-white text-right pr-3" defaultValue={candidate.name + '/' + candidate.party} />
        <InputGroup.Append>
          <InputGroup.Radio name="votingGroup" aria-label={candidate.name + '/' + candidate.party} onSelect={(event) => props.handleFormSelect(event)}/>
        </InputGroup.Append>
      </InputGroup>
    );
  });
}

export default VoteRow;

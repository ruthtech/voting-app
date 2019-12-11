import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "./style.css";

function EditDistrictConfirm() {

    return (
      <div className="container bg-grey full-screen">
        <div className="row">
          <div className="col">
            <h1>Is this correct?</h1>
          </div>
        </div>
        <div className="row">
          <div className="col bg-white centre-align-div">
            <p>1 Anywhere Road, Waterloo Ontario, L1L 1X1</p>
          </div>
        </div>
        <div className="row bottom">
          <div className="col">
            <Form>
              <div className="spread-align-div">
                <Button variant="secondary" type="button">
                  Edit
                </Button>
                <Button variant="secondary" type="submit">
                  Confirm
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
}

export default EditDistrictConfirm;

import React from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import "./style.css";

function EditDistrict() {

    return (
        <div className="container bg-grey full-screen">
            <div className="row">
                <div className="col">
                    <h1>Enter your new address</h1>
                </div>
            </div>
            <div className="row bottom">
              <div className="col">
                <p>This is a test. This is still a test. Do not pass Go. Do not collect $200.</p>
                <Form>
                    <Form.Group controlId="formBasicUUID">
                      <Form.Label className="entry-field-label">Address</Form.Label>
                      <Form.Control type="text" placeholder="Enter address" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="entry-field-label">City</Form.Label>
                      <Form.Control type="text" placeholder="Enter city" />
                    </Form.Group>

                    <DropdownButton id="provinceDropdown" title="Province/Territory" variant="secondary">
                    <Dropdown.Item >Alberta</Dropdown.Item>
                        <Dropdown.Item >British Columbia</Dropdown.Item>
                        <Dropdown.Item >Manitoba</Dropdown.Item>
                        <Dropdown.Item >New Brunswick</Dropdown.Item>
                        <Dropdown.Item >Newfoundland and Labrador</Dropdown.Item>
                        <Dropdown.Item >Northwest Territories</Dropdown.Item>
                        <Dropdown.Item >Nova Scotia</Dropdown.Item>
                        <Dropdown.Item >Nunavut</Dropdown.Item>
                        <Dropdown.Item >Ontario</Dropdown.Item>
                        <Dropdown.Item >Prince Edward Island</Dropdown.Item>
                        <Dropdown.Item >Quebec</Dropdown.Item>
                        <Dropdown.Item >Saskatchewan</Dropdown.Item>
                        <Dropdown.Item >Yukon</Dropdown.Item>
                    </DropdownButton>

                    <div className="right-align-div">
                      <Button variant="secondary" type="submit" >
                        Save
                      </Button>
                    </div>
                  </Form>
              </div>
            </div>
        </div>
    );
}

export default EditDistrict;

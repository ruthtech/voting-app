import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import EditDistrictConfirm from './EditDistrictConfirm';
import "./style.css";

function EditDistrict() {
  const [voter, setVoter] = useState();
  const [streetNo, setStreetNo] = useState();
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [province, setProvince] = useState();
  const [postalCode, setPostalCode] = useState();
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 means render default form, 1 means EditDistrictConfirm

  const handleFormSubmit = async (event) => {
    try {
      let eAddress = escape(address);
      let eCity = escape(city);
      // province is already escaped because it's the id of the dropdown field
      voter.streetNo = streetNo;
      voter.address = eAddress;
      voter.city = eCity;
      voter.province = province;
      voter.postalCode = postalCode.replace(/\s/g, "");
      setVoter(voter);
    } catch( err ) {
      console.log(err);
    }
  }

  // active component id 1
  const renderConfirm = () => {
    return <EditDistrictConfirm user={voter}/>
  };

  // active component id 0
  const renderDefault = () => {
    return (
      <div className="container-fluid bg-grey full-screen">
          <div className="row">
              <div className="col">
                  <h1>Enter your new address</h1>
              </div>
          </div>
          <div className="row pb-3">
            <div className="col ">
              <Form>
                  <Form.Group controlId="formBasicAddress">
                    <Form.Label id="streetNoLabel" className="entry-field-label">Street Number</Form.Label>
                    <Form.Control id="streetNo" type="number" onChange={event => setStreetNo(event.target.value)}/>

                    <Form.Label className="entry-field-label">Address</Form.Label>
                    <Form.Control type="text" onChange={event => setAddress(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicCity">
                    <Form.Label className="entry-field-label">City</Form.Label>
                    <Form.Control type="text" onChange={event => setCity(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPostalcode">
                    <Form.Label className="entry-field-label">Postal Code</Form.Label>
                    <Form.Control type="text" onChange={event => setPostalCode(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="provinces" className="right-align-div">
                    <DropdownButton id="provinceDropdown" title="Province/Territory" variant="secondary">
                      <Dropdown.Item id="Alberta" onClick={(event) => setProvince(event.target.id)}>Alberta</Dropdown.Item>
                      <Dropdown.Item id="British%20Columbia" onClick={(event) => setProvince(event.target.id)}>British Columbia</Dropdown.Item>
                      <Dropdown.Item id="Manitoba" onClick={(event) => setProvince(event.target.id)}>Manitoba</Dropdown.Item>
                      <Dropdown.Item id="New%20Brunswick" onClick={(event) => setProvince(event.target.id)}>New Brunswick</Dropdown.Item>
                      <Dropdown.Item id="Newfoundland%20and%20Labrador" onClick={(event) => setProvince(event.target.id)}>Newfoundland and Labrador</Dropdown.Item>
                      <Dropdown.Item id="Northwest%20Territories" onClick={(event) => setProvince(event.target.id)}>Northwest Territories</Dropdown.Item>
                      <Dropdown.Item id="Nova%20 Scotia" onClick={(event) => setProvince(event.target.id)}>Nova Scotia</Dropdown.Item>
                      <Dropdown.Item id="Nunavut" onClick={(event) => setProvince(event.target.id)}>Nunavut</Dropdown.Item>
                      <Dropdown.Item id="Ontario" onClick={(event) => setProvince(event.target.id)}>Ontario</Dropdown.Item>
                      <Dropdown.Item id="Prince%20Edward%20Island" onClick={(event) => setProvince(event.target.value)}>Prince Edward Island</Dropdown.Item>
                      <Dropdown.Item id="Quebec" onClick={(event) => setProvince(event.target.id)}>Quebec</Dropdown.Item>
                      <Dropdown.Item id="Saskatchewan" onClick={(event) => setProvince(event.target.id)}>Saskatchewan</Dropdown.Item>
                      <Dropdown.Item id="Yukon" onClick={(event) => setProvince(event.target.id)}>Yukon</Dropdown.Item>
                    </DropdownButton>
                  </Form.Group>

                  <Form.Group controlId="formSubmit" className="right-align-div">
                    <Button variant="secondary w-50" type="submit" 
                      onClick={(event) => {
                        handleFormSubmit(event); // save the new address to the database
                        setActiveComponentId(1); // switch to the Edit District Confirm page
                      }}>
                      Save
                    </Button>
                  </Form.Group>
                </Form>
            </div>
          </div>
      </div>
    )
  };

  const renderActiveComponent = () => {
    switch(activeComponentId) {
      case(1): {
        return renderConfirm();
      }

      case(0):
      default: {
        return renderDefault();
      }
    }
  };

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

export default EditDistrict;

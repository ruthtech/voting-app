import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import EditDistrictConfirm from './EditDistrictConfirm';
import Landing from './Landing';
import "./style.css";

function EditDistrict(props) {
  console.log("EditDistrict, props are ", props);

  const [voter, setVoter] = useState();
  const [streetNo, setStreetNo] = useState(props.location.streetNo);
  const [address, setAddress] = useState(props.location.address);
  const [city, setCity] = useState(props.location.city);
  const [province, setProvince] = useState(props.location.province);
  const [postalCode, setPostalCode] = useState(props.location.postalCode);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 means render default form, 1 means EditDistrictConfirm

  const handleFormSubmit = async (event) => {
    try {
      // province is already escaped because it's the id of the dropdown field
      voter.streetNo = streetNo;
      voter.address = address;
      voter.city = city;
      voter.province = province;
      voter.postalCode = postalCode.replace(/\s/g, "");
      setVoter(voter);
    } catch( err ) {
      console.log(err);
    }
  }

  // active component id 2
  const renderBack = () => {
    return <Landing />;
  };

  // active component id 1
  const renderConfirm = () => {
    return <EditDistrictConfirm user={voter}/>
  };

  // active component id 0
  const renderDefault = () => {
    return (
      <div className="container-fluid bg-almostWhite full-screen">
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
                    <Form.Control id="streetNo" type="number" value={streetNo} onChange={event => setStreetNo(event.target.value)}/>

                    <Form.Label className="entry-field-label">Address</Form.Label>
                    <Form.Control type="text" value={address} onChange={event => setAddress(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicCity">
                    <Form.Label className="entry-field-label">City</Form.Label>
                    <Form.Control type="text" value={city} onChange={event => setCity(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPostalcode">
                    <Form.Label className="entry-field-label">Postal Code</Form.Label>
                    <Form.Control type="text" value={postalCode} onChange={event => setPostalCode(event.target.value)}/>
                  </Form.Group>

                  <Form.Group controlId="provinces" value={province} className="right-align-div">
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

                  <Form.Group controlId="formSubmit" className="centre-align-div">
                    <Button variant="secondary w-50 mr-3" type="button" 
                      onClick={ () => { setActiveComponentId(2)}}>
                      Back
                    </Button>
                    <Button variant="secondary w-50 ml-3" type="submit" 
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
      case(2): {
        return renderBack();
      }

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

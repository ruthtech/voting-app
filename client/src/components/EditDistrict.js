import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import "./style.css";

function EditDistrict(props) {
  const [address, setAddress] = useState();
  const [city, setCity] = useState();
  const [province, setProvince] = useState();

  const handleFormSubmit = async (event) => {
    let newDistrict = await axios.get(`/api/findDistrict/${address}/${city}/${province}`);
    let user = { ...props.user.data };
    user.address = address;
    user.city = city;
    user.province = province;
    user.district = newDistrict;

    props.history.push({
      pathname: "/editdistrictconfirm",
      user: user});
  }

    return (
      <UserContext.Consumer>
        {
        <div className="container bg-grey full-screen">
            <div className="row">
                <div className="col">
                    <h1>Enter your new address</h1>
                </div>
            </div>
            <div className="row bottom">
              <div className="col">
                <Form>
                    <Form.Group controlId="formBasicUUID">
                      <Form.Label className="entry-field-label">Address</Form.Label>
                      <Form.Control type="text" placeholder="Enter address" onChange={event => setAddress(event.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="entry-field-label">City</Form.Label>
                      <Form.Control type="text" placeholder="Enter city" onChange={event => setCity(event.target.value)}/>
                    </Form.Group>

                    <DropdownButton id="provinceDropdown" title="Province/Territory" variant="secondary" onChange={event => setProvince(event.target.value)}>
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
                      <Button variant="secondary" type="submit" onClick={(event) => {handleFormSubmit(event)}}>
                        Save
                      </Button>
                    </div>
                  </Form>
              </div>
            </div>
        </div>
        }
        </UserContext.Consumer>
    );
}

export default EditDistrict;

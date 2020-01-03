import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import EditDistrictConfirm from './EditDistrictConfirm';
import Landing from './Landing';
import "./style.css";

class EditDistrict extends Component {
  constructor(props) {
    super(props);
  }

  // Location data is not escaped until right before it is sent to axios. 
  // Sending in location instead of user/voter because the query to the server to find out if the address exists isn't associated with a user. 
  state = {
    location: this.props.location,
    activeComponentId: 0 // 0 means render default form, 1 means EditDistrictConfirm
  }

  handleFormSubmit = async (event) => {
    try {
      event.preventDefault();
      // Check if the address is valid or not. If it's not, replace it with the nearest valid address.
      let newLocation = await axios.get(`/api/address/${escape(this.state.location.streetNo)}/${escape(this.state.location.streetName)}/${escape(this.state.location.city)}/${escape(this.state.location.province)}/${escape(this.state.location.postcode.replace(/\s/g, ""))}`);
      this.setState({ location: newLocation.data });
    } catch( err ) {
      console.log(err);
    }
  }

  // active component id 2
  renderBack = () => {
    return <Landing />;
  };

  // active component id 1
  renderConfirm = () => {
    let voter = this.context.user;
    return <EditDistrictConfirm location={this.state.location} username={voter._doc.login.username}/>
  };

  // active component id 0
  renderDefault = () => {
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
                  <Form.Group id="formBasicAddress">
                    <Form.Label id="streetNoLabel" className="entry-field-label">Street Number</Form.Label>
                    <Form.Control id="streetNo" type="number" value={this.state.location.streetNo} onChange={event => this.setState({ location: {...this.state.location, streetNo:event.target.value}})} />

                    <Form.Label className="entry-field-label">Address</Form.Label>
                    <Form.Control type="text" value={this.state.location.streetName} onChange={event => this.setState({ location: {...this.state.location, streetName:event.target.value}})}/>
                  </Form.Group>

                  <Form.Group id="formBasicCity">
                    <Form.Label className="entry-field-label">City</Form.Label>
                    <Form.Control type="text" value={this.state.location.city} onChange={event => this.setState({ location: {...this.state.location, city:event.target.value}})}/>
                  </Form.Group>

                  <Form.Group id="formBasicPostalcode">
                    <Form.Label className="entry-field-label">Postal Code</Form.Label>
                    <Form.Control type="text" value={this.state.location.postcode} onChange={event => this.setState({ location: {...this.state.location, postcode:event.target.value}})}/>
                  </Form.Group>

                  <Form.Group value={this.state.location.province} className="right-align-div">
                    <DropdownButton id="provinceDropdown" title="Province/Territory" variant="secondary">
                      <Dropdown.Item id="Alberta" onClick={() => this.setState({ location: {...this.state.location, province:'Alberta'}})}>Alberta</Dropdown.Item>
                      <Dropdown.Item id="BritishColumbia" onClick={() => this.setState({ location: {...this.state.location, province:'British Columbia'}})}>British Columbia</Dropdown.Item>
                      <Dropdown.Item id="Manitoba" onClick={() => this.setState({ location: {...this.state.location, province:'Manitoba'}})}>Manitoba</Dropdown.Item>
                      <Dropdown.Item id="NewBrunswick" onClick={() => this.setState({ location: {...this.state.location, province:'New Brunswick'}})}>New Brunswick</Dropdown.Item>
                      <Dropdown.Item id="NewfoundlandandLabrador" onClick={() => this.setState({ location: {...this.state.location, province:'Newfoundland and Labrador'}})}>Newfoundland and Labrador</Dropdown.Item>
                      <Dropdown.Item id="NorthwestTerritories" onClick={() => this.setState({ location: {...this.state.location, province:'Northwest Territories'}})}>Northwest Territories</Dropdown.Item>
                      <Dropdown.Item id="NovaScotia" onClick={() => this.setState({ location: {...this.state.location, province:'Nova Scotia'}})}>Nova Scotia</Dropdown.Item>
                      <Dropdown.Item id="Nunavut" onClick={() => this.setState({ location: {...this.state.location, province:'Nunavut'}})}>Nunavut</Dropdown.Item>
                      <Dropdown.Item id="Ontario" onClick={() => this.setState({ location: {...this.state.location, province:'Ontario'}})}>Ontario</Dropdown.Item>
                      <Dropdown.Item id="PrinceEdwardIsland" onClick={() => this.setState({ location: {...this.state.location, province:'Prince Edward Island'}})}>Prince Edward Island</Dropdown.Item>
                      <Dropdown.Item id="Quebec" onClick={() => this.setState({ location: {...this.state.location, province:'Quebec'}})}>Quebec</Dropdown.Item>
                      <Dropdown.Item id="Saskatchewan" onClick={() => this.setState({ location: {...this.state.location, province:'Saskatchewan'}})}>Saskatchewan</Dropdown.Item>
                      <Dropdown.Item id="Yukon" onClick={() => this.setState({ location: {...this.state.location, province:'Yukon'}})}>Yukon</Dropdown.Item>
                    </DropdownButton>
                  </Form.Group>

                  <Form.Group controlId="formSubmit" className="centre-align-div">
                    <Button variant="secondary w-50 mr-3" type="button" 
                      onClick={ () => { this.state.activeComponentId = 2 } }>
                      Back
                    </Button>
                    <Button variant="secondary w-50 ml-3" type="submit" 
                      onClick={(event) => {
                        this.handleFormSubmit(event); // Check that the address exists and send it, or the closest matching existing address, to the confirmation page.
                        this.state.activeComponentId = 1; // switch to the Edit District Confirm page
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

  renderActiveComponent = () => {
    switch(this.state.activeComponentId) {
      case(2): {
        return this.renderBack();
      }

      case(1): {
        return this.renderConfirm();
      }

      case(0):
      default: {
        return this.renderDefault();
      }
    }
  };

  render() {
    return this.renderActiveComponent();
  }
}
EditDistrict.contextType = UserContext;

export default EditDistrict;

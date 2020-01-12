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
import log from 'loglevel';

class EditDistrict extends Component {
  // Location data is not escaped until right before it is sent to axios. 
  // Sending in location instead of user/voter because the query to the server to find out if the address exists isn't associated with a user. 
  state = {
    location: this.props.location,
    activeComponentId: 0 // 0 means render default form, 1 means EditDistrictConfirm
  }

  handleFormSubmit = async (event) => {
    try {
      event.preventDefault();
      const log = this.context.log;
      // Check if the address is valid or not. If it's not, replace it with the nearest valid address.
      // escape is deprecated and doesn't work on the Quebec city names with accents. Use encodeURI instead.
      log.debug(`EditDistrict about to call /api/address/${encodeURI(this.state.location.street.number)}/${encodeURI(this.state.location.street.name)}/${encodeURI(this.state.location.city)}/${encodeURI(this.state.location.state)}/${encodeURI(this.state.location.postcode.replace(/\s/g, ""))}`);
      let newLocation = await axios.get(`/api/address/${encodeURI(this.state.location.street.number)}/${encodeURI(this.state.location.street.name)}/${encodeURI(this.state.location.city)}/${encodeURI(this.state.location.state)}/${encodeURI(this.state.location.postcode.replace(/\s/g, ""))}`);
      log.debug("EditDistrict, newLocation is ", newLocation.data);
      this.setState({ location: newLocation.data });
      log.debug("EditDistrict, after new location state is ", this.state.location);
      this.setState({ activeComponentId: 1 });; // switch to the Edit District Confirm page
    } catch( err ) {
      log.error(err);
    }
  }

  // active component id 2
  renderBack = () => {
    return <Landing />;
  };

  // active component id 1
  renderConfirm = () => {
    const voter = this.context.user;
    const log = this.context.log;
    log.debug("EditDistrict about to confirm, latitude is " + this.state.location.coordinates.latitude + " and longitude are " + this.state.location.coordinates.longitude);
    return <EditDistrictConfirm location={this.state.location} username={voter.login.username} log={log}/>
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
                    <Form.Control id="streetNo" type="number" value={this.state.location.street.number} onChange={
                      event => {
                        let newLocation = {...this.state.location};
                        newLocation.street.number = event.target.value;
                        this.setState({ location: newLocation});
                      }} />
                    <Form.Label className="entry-field-label">Address</Form.Label>
                    <Form.Control type="text" value={this.state.location.street.name} onChange={
                      event => {
                        let newLocation = {...this.state.location};
                        newLocation.street.name = event.target.value;
                        this.setState({ location: newLocation});
                      }} />
                  </Form.Group>

                  <Form.Group id="formBasicCity">
                    <Form.Label className="entry-field-label">City</Form.Label>
                    <Form.Control type="text" value={this.state.location.city} onChange={event => this.setState({ location: {...this.state.location, city:event.target.value}})}/>
                  </Form.Group>

                  <Form.Group id="formBasicPostalcode">
                    <Form.Label className="entry-field-label">Postal Code</Form.Label>
                    <Form.Control type="text" value={this.state.location.postcode} onChange={event => this.setState({ location: {...this.state.location, postcode:event.target.value}})}/>
                  </Form.Group>

                  <Form.Group value={this.state.location.state} className="right-align-div">
                    <DropdownButton id="provinceDropdown" title="Province/Territory" variant="secondary">
                      <Dropdown.Item id="Alberta" onClick={() => {this.setState({ location: {...this.state.location, state:'Alberta'}})}}>Alberta</Dropdown.Item>
                      <Dropdown.Item id="BritishColumbia" onClick={() => this.setState({ location: {...this.state.location, state:'British Columbia'}})}>British Columbia</Dropdown.Item>
                      <Dropdown.Item id="Manitoba" onClick={() => this.setState({ location: {...this.state.location, state:'Manitoba'}})}>Manitoba</Dropdown.Item>
                      <Dropdown.Item id="NewBrunswick" onClick={() => this.setState({ location: {...this.state.location, state:'New Brunswick'}})}>New Brunswick</Dropdown.Item>
                      <Dropdown.Item id="NewfoundlandandLabrador" onClick={() => this.setState({ location: {...this.state.location, state:'Newfoundland and Labrador'}})}>Newfoundland and Labrador</Dropdown.Item>
                      <Dropdown.Item id="NorthwestTerritories" onClick={() => this.setState({ location: {...this.state.location, state:'Northwest Territories'}})}>Northwest Territories</Dropdown.Item>
                      <Dropdown.Item id="NovaScotia" onClick={() => this.setState({ location: {...this.state.location, state:'Nova Scotia'}})}>Nova Scotia</Dropdown.Item>
                      <Dropdown.Item id="Nunavut" onClick={() => this.setState({ location: {...this.state.location, state:'Nunavut'}})}>Nunavut</Dropdown.Item>
                      <Dropdown.Item id="Ontario" onClick={() => this.setState({ location: {...this.state.location, state:'Ontario'}})}>Ontario</Dropdown.Item>
                      <Dropdown.Item id="PrinceEdwardIsland" onClick={() => this.setState({ location: {...this.state.location, state:'Prince Edward Island'}})}>Prince Edward Island</Dropdown.Item>
                      <Dropdown.Item id="Quebec" onClick={() => this.setState({ location: {...this.state.location, state:'Quebec'}})}>Quebec</Dropdown.Item>
                      <Dropdown.Item id="Saskatchewan" onClick={() => this.setState({ location: {...this.state.location, state:'Saskatchewan'}})}>Saskatchewan</Dropdown.Item>
                      <Dropdown.Item id="Yukon" onClick={() => this.setState({ location: {...this.state.location, state:'Yukon'}})}>Yukon</Dropdown.Item>
                    </DropdownButton>
                  </Form.Group>

                  <Form.Group controlId="formSubmit" className="centre-align-div">
                    <Button variant="secondary w-50 mr-3" type="button" 
                      onClick={ () => { this.setState({ activeComponentId: 2 }); } }>
                      Home
                    </Button>
                    <Button variant="secondary w-50 ml-3" type="submit" 
                      onClick={(event) => {
                        this.handleFormSubmit(event); // Check that the address exists and send it, or the closest matching existing address, to the confirmation page.
                      }}>
                      Next
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

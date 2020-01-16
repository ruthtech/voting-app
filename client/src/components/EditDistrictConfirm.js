import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "./assets/css/style.css";
import Landing from './Landing';
import EditDistrict from './EditDistrict';
import UserContext from '../utils/UserContext';

function EditDistrictConfirm(props) {
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 is render default (this confirmation page) and 1 is go back and edit (edit district), 2 is for landing

    const handleFormSubmit = async (handleLogin) => {
      try {
        let newUser = await axios.put(`/api/updateAddress/${encodeURI(props.username)}/${encodeURI(props.location.street.number)}/${encodeURI(props.location.street.name)}/${encodeURI(props.location.city)}/${encodeURI(props.location.state)}/${encodeURI(props.location.postcode)}`);
        props.log.debug("EditDistrictConfirm, newUser.data ", newUser.data);
        handleLogin(newUser.data); // Update the user in the context.
        props.log.debug("EditDistrictConfirm after handleLogin"); 
      } catch ( err ) {
        props.log.error(err);
      }
    };

    // active component id 1
    const renderEditDistrict = () => {
      return <EditDistrict location={props.location}/>;
    };

    // active component id 2
    const renderHome = () => {
      return <Landing />;
    };

    // active component id 0
    const renderDefault = (handleLogin) => {
      props.log.debug("EditDistrictConfirm render default location is ", props.location);
      return (
        <div className="container-fluid bg-almostWhite full-screen">
        <div className="row pt-3">
          <div className="col">
            <h4>Is this correct?</h4>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h6>If there were any problems locating the address that you entered, the closest address is displayed below.</h6>
          </div>
        </div>
        <div className="row">
          <div className="col bg-white centre-align-div">
            <p>{props.location.street.number} {props.location.street.name}, {props.location.city}, {props.location.state}, {props.location.postcode}</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Button variant="secondary w-100" type="button" 
              onClick={ () => { setActiveComponentId(1)}}>
              Edit
            </Button>
          </div>
          <div className="col">
            <Button variant="secondary w-100" type="submit" 
                onClick={
                () => {
                  handleFormSubmit(handleLogin);
                  setActiveComponentId(2);
                }}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
      );
    };

    const renderActiveComponent = (handleLogin) => {
      switch(activeComponentId) {
        case(1): {
          return renderEditDistrict();
        }

        case(2): {
          return renderHome();
        }

        case(0):
        default: {
          return renderDefault(handleLogin);
        }
      }
    };

    return (
      <UserContext.Consumer >
       {
         ({handleLogin}) => {
           return renderActiveComponent(handleLogin)
         }
      }
       </UserContext.Consumer>
      );
}

export default EditDistrictConfirm;

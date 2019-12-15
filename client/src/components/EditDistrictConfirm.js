import React, {useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "./style.css";
import Landing from './Landing';
import EditDistrict from './EditDistrict';

function EditDistrictConfirm(props) {
  // console.log("EditDistrictConfirm, props is ", props);
  const [user] = useState(props.user);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 is render default (this confirmation page) and 1 is go back and edit (edit district), 2 is for landing

    const handleFormSubmit = async (event) => {
      try {
        let newDistrict = await axios.put(`/api/updateAddress/${user.uuid}/${user.address}/${user.city}/${user.province}/${user.district}`);
        // TODO FINISH
        // TODO Check if escaped? Or it's safe to assume that it's escaped since only EditDistrict calls EditDistrictConfirm?
      } catch ( err ) {
        console.log(err);
      }
    };

    // active component id 1
    const renderEditDistrict = () => {
      return <EditDistrict />;
    };

    // active component id 2
    const renderHome = () => {
      return <Landing />;
    };

    // active component id 0
    const renderDefault = () => {
      // console.log("EditDistrictConfirm renderDefault user is ", user);
      return (
        <div className="container-fluid bg-grey full-screen">
        <div className="row pt-3">
          <div className="col">
            <h4>Is this correct?</h4>
          </div>
        </div>
        <div className="row">
          <div className="col bg-white centre-align-div">
            <p>{unescape(user.address)}, {unescape(user.city)}, {unescape(user.province)}</p>
          </div>
        </div>
        <div className="row bottom">
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
                  handleFormSubmit();
                  setActiveComponentId(2);
                }}>
              Confirm
            </Button>
          </div>
        </div>
      </div>
      );
    };

    const renderActiveComponent = () => {
      // console.log("EditDistrictConfirm id is ", activeComponentId);
      switch(activeComponentId) {
        case(1): {
          return renderEditDistrict();
        }

        case(2): {
          return renderHome();
        }

        case(0):
        default: {
          return renderDefault();
        }
      }
    };

    return (
      renderActiveComponent()
    );
}

export default EditDistrictConfirm;

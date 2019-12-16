import React, {useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "./style.css";
import Landing from './Landing';
import EditDistrict from './EditDistrict';
import UserContext from '../utils/UserContext';

function EditDistrictConfirm(props) {
  // console.log("EditDistrictConfirm, props is ", props);
  const [user, setUser] = useState(props.user);
  const [activeComponentId, setActiveComponentId] = useState(0); // 0 is render default (this confirmation page) and 1 is go back and edit (edit district), 2 is for landing
  console.log("EditDistrictConfirm ", user);

    const handleFormSubmit = async (handleLogin, event) => {
      try {
        let newUser = await axios.put(`/api/updateAddress/${user._doc.login.username}/${user.streetNo}/${user.address}/${user.city}/${user.province}/${user.postalCode}`);
        console.log("EditDistrictConfirm, new user is ", newUser);
        setUser(newUser.data);
        props.user = newUser.data;
        handleLogin(newUser.data);
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
    const renderDefault = (handleLogin) => {
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
            <p>{user.streetNo} {unescape(user.address)}, {unescape(user.city)}, {unescape(user.province)}, {unescape(user.postalCode)}</p>
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

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import "./style.css";
import UserContext from '../utils/UserContext';

function EditDistrictConfirm(props) {
    const handleFormSubmit = async (event) => {
      let newDistrict = await axios.put(`/api/updateAddress/${props.user.data.uuid}/${props.user.data.address}/${props.user.data.city}/${props.user.data.province}/${props.user.data.district}`);
      // TODO FINISH
    };

    return (
      <UserContext.Consumer>
        {
      <div className="container bg-grey full-screen">
        <div className="row">
          <div className="col">
            <h1>Is this correct?</h1>
          </div>
        </div>
        <div className="row">
          <div className="col bg-white centre-align-div">
            <p>{props.user.data.address}</p>
          </div>
        </div>
        <div className="row bottom">
          <div className="col">
            <Form>
              <div className="spread-align-div">
                <Button variant="secondary" type="button" onClick={
                        props.history.push({
                            pathname: "/editdistrict",
                            user: props.user.data
                        })}>
                  Edit
                </Button>
                <Button variant="secondary" type="submit" onClick={(event) => handleFormSubmit(event)}>
                  Confirm
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

export default EditDistrictConfirm;

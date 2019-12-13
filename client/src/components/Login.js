// import React from 'react';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import "./style.css";

function Login() {
  const [uuid, setUUID] = useState();
  const [password, setPassword] = useState();

  const handleFormSubmit = async (uuid, password, handleLogin, event) => {
    try {
      event.preventDefault();
      uuid = escape(uuid);

      let query = `/api/login/${uuid}/${password}`;
      const user = await axios.get(query);
      console.log("Login.js login with uuid " + uuid + " found the following user ");
      console.log(user);
      if(user !== []) {
        // If user is empty either the UUID was not found or the password is incorrect.
        // The page will continue to show this Login page until a user is found & verified.
        handleLogin(user.data[0]);
      }
    } catch ( err ) {
      console.log(err);

      // null means that no user is logged in.
      handleLogin(null);
    }
  };

    return (
      <UserContext.Consumer>
      {
        ({handleLogin}) =>
        <div className="container bg-grey full-screen">
            <div className="row">
                <div className="col heading">
                    <h1>Canada Votes Online</h1>
                </div>
            </div>
            <div className="row bottom">
                <div className="col">
                  <Form>
                    <Form.Group controlId="formBasicUUID">
                      <Form.Label className="entry-field-label">UUID</Form.Label>
                      <Form.Control type="text" value={uuid} onChange={event => setUUID(event.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="entry-field-label">Password</Form.Label>
                      <Form.Control type="password" value={password} onChange={event => setPassword(event.target.value)}/>
                    </Form.Group>

                    <div className="right-align-div">
                      <Button variant="secondary" type="submit" onClick={(event) => {handleFormSubmit(uuid, password, handleLogin, event)}}>
                        Sign in
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

export default Login;

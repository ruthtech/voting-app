// import React from 'react';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import UserContext from '../utils/UserContext';
import CanadaFlag from './assets/media/canada-flag.svg';
import "./style.css";

function Login(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const handleFormSubmit = async (username, password, handleLogin, event) => {
    try {
      event.preventDefault();

      username = encodeURI(username);
      if(username==='admin') {
        // Temporary. How do we want to support the adminstrator running the simulation for the user to see?
        handleLogin({ name: "admin", isAdmin: true });
        return;
      }

      let query = `/api/login/${username}/${password}`;
      const user = await axios.get(query);
      if(!user.data.isVerified) {
        // Either the UUID was not found or the password is incorrect.
        // The page will continue to show this Login page until a user is found & verified.
        handleLogin(null);
        return;
      }

      // Success
      handleLogin(user.data.isVerified);
    } catch ( err ) {
      props.log.error(err);

      // null means that no user is logged in.
      handleLogin(null);
    }
  };

    return (
      <UserContext.Consumer>
      {
        ({handleLogin}) =>
        <div className="container-fluid bg-almostWhite full-screen">
            <div className="row flag-block ">
              <Image className="bg-white" src={CanadaFlag} alt="Canada Flag" />
            </div>
            <div className="row">
                <div className="col heading">
                    <h1>Canada Votes Online</h1>
                </div>
            </div>
            <div className="row bottom-page">
                <div className="col">
                  <Form>
                    <Form.Group id="formBasicUUID">
                      <Form.Label className="entry-field-label">Username</Form.Label>
                      <Form.Control type="text" defaultValue={username} onChange={event => setUsername(event.target.value)}/>
                    </Form.Group>

                    <Form.Group id="formBasicPassword">
                      <Form.Label className="entry-field-label">Password</Form.Label>
                      <Form.Control type="password" defaultValue={password} onChange={event => setPassword(event.target.value)}/>
                    </Form.Group>

                    <div className="right-align-div">
                      <Button variant="secondary" type="submit" onClick={(event) => {handleFormSubmit(username, password, handleLogin, event)}}>
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

// import React from 'react';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./style.css";

function LoginForm(props) {
  const [uuid, setUUID] = useState();
  const [password, setPassword] = useState();


    return (
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
                      <Button variant="secondary" type="submit" onClick={(event) => {props.handleFormSubmit(uuid, password, event)}}>
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;

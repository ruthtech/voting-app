import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./style.css";

function Login(props) {

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
                      <Form.Control type="text" placeholder="Enter uuid" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="entry-field-label">Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <div className="right-align-div">
                      <Button variant="secondary" type="submit" >
                        Sign in
                      </Button>
                    </div>
                  </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;

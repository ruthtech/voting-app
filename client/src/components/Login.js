import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function Login() {

    return (
        <div className="container" style={{ backgroundColor: "#C4C4C4" }}>
            <div className="row">
                <div className="col">
                    <h1>Canada Votes Online</h1>
                </div>
            </div>
            <div className="row">
                <div className="col pb-3">
                  <Form>
                    <Form.Group controlId="formBasicUUID">
                      <Form.Label className="font-weight-bold mb-0">UUID</Form.Label>
                      <Form.Control type="text" placeholder="Enter uuid" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label className="font-weight-bold mb-0">Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="secondary" type="submit">
                      Sign in
                    </Button>
                  </Form>
                </div>
            </div>
        </div>
    );
}

export default Login;

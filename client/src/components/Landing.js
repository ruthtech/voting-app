import React from 'react';
import "./style.css";

function Landing(props) {

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                <Form>
                    <Form.Group controlId="editElectoralDistrict">
                      <Form.Label>Your district is {props.user.district}</Form.Label>
                      <Button variant="secondary">Edit</Button>
                    </Form.Group>
                  </Form>                
                </div>
            </div>
        </div>
    );
}

export default Landing;

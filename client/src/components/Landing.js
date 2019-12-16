import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import UserContext from '../utils/UserContext';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';
import LoadingSpinner from './LoadingSpinner';
import "./style.css";


function Landing() {
    // console.log("Landing");
    const [voter, setVoter] = useState(null);
    const [activeComponentId, setActiveComponentId] = useState(1); // 0 is render default, 1 is LoadingSpinner, 2 is edit district, 3 is View Candidates, 4 is Vote

    useEffect(() => {
        // console.log("useEffect");
        setActiveComponentId(0);
        // console.log(subcomponent);
    }, [voter]);

    // active component id 0
    function renderDefault() {
        // console.log("renderDefault");
        if(voter == null) {
            // Not ready to render yet
            // console.log("voter is null, returning");
            return;
        }
        console.log("Landing renderDefault, voter is ", voter);


        setActiveComponentId(0);
        return (
            <div className="container-fluid bg-map full-screen">
                <div className="row">
                    <div className="col-8 col-sm-9 mt-3 ml-3 bg-white text-center pt-2">
                       Your district is {voter._doc.location.district}
                    </div>
                    <div className="col-3 col-sm-2 mt-3">
                      <Button variant="secondary w-100" 
                              onClick={ () => { setActiveComponentId(2) }}>
                         Edit</Button>
                    </div>
                </div>
                <div className="row pb-3 bottom">
                    <div className="col">
                        <Button variant="secondary w-100" 
                            onClick={ () => { setActiveComponentId(3) }}>
                            View Candidates</Button>
                    </div>
                    <div className="col">
                        <Button variant="secondary w-100"
                            onClick={ () => { setActiveComponentId(4) }}>
                            Vote</Button>
                    </div>
                </div>
            </div>
        );
    }

    // active component 1
    const renderLoading = () => {
        return <LoadingSpinner />;
    };

    // active component 2
    const renderEditDistrict = () => {
        return <EditDistrict />;
    };

    // active component 3
    const renderViewCandidates = () => {
        return <ViewCandidates />;
    }

    // active component 4
    const renderVote = () => {
        return <Vote />;
    }

    const renderActiveComponent = () => {
        switch(activeComponentId) {
            case(4): {
                return renderVote();
            }

            case(3): {
                return renderViewCandidates();
            }

            case(2): {
                return renderEditDistrict();
            }

            case(1): {
                return renderLoading();
            }

            case(0):
            default: {
                return renderDefault();
            }
        }
    };

    return (
      <UserContext.Consumer>
      {
          ({user}) => {
            // Can't set this on function load because we need to know 
            // the user's data.
            setVoter(user);
            return renderActiveComponent();
          }
      }
      </UserContext.Consumer>  

    );
}

export default Landing;

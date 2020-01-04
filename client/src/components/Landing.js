import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./style.css";
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';

// Because any key embedded in the .env file will be included in the build, 
// which reveals an API key that we eon't want revealed, 
//import "../mapboxAPIKey.js"; // when testing locally
import "../mapboxAPIKey-heroku.js"; // when deploying to Heroku

// const ottawaLat = 45.416667;
// const ottawaLong = -75.7;

class Landing extends Component {
  // Setting the component's initial state
  state = {
    activeComponentId: 0,
    map: null
  };

  componentDidMount() {
    if(this.state.activeComponentId === 0) {
      // Is this the component with the map?
      let voter = this.context.user;
      const voterLatitude = voter._doc.location.coordinates.latitude;
      const voterLongitude = voter._doc.location.coordinates.longitude;

      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [voterLongitude, voterLatitude],
        zoom: 12
      });
      this.setState({ map: newMap });
    }
  }

  

  componentDidUpdate() {
    if(this.state.activeComponentId === 0) {
      let voter = this.context.user;
      const voterLatitude = voter._doc.location.coordinates.latitude;
      const voterLongitude = voter._doc.location.coordinates.longitude;

      this.state.map.setCenter([voterLongitude, voterLatitude]);
    }
  }
  
  renderDefault = () => {
    let voter = this.context.user;
    return (
      <div className="container-fluid full-screen">
        <div className="row">
            <div className="col-8 col-sm-9 mt-3 ml-3 bg-white text-center pt-2 mapFormWidget">
                Your district is {voter._doc.location.district}
            </div>
            <div className="col-3 col-sm-2 mt-3">
              <Button variant="secondary w-100" 
                      onClick={ () => { this.setState({ activeComponentId: 2 })}} >
                  Edit</Button>
            </div>
        </div>
        <div className="row">
           <div ref={el => this.mapContainer = el} className="col mapContainer" />
        </div>
        <div className="row pb-3">
            <div className="col">
                <Button variant="secondary w-100" 
                    onClick={ () => { this.setState({ activeComponentId: 3 })}} >
                    View Candidates</Button>
            </div>
            <div className="col">
                <Button variant="secondary w-100"
                    onClick={ () => { this.setState({ activeComponentId: 4 })}} >
                    Vote</Button>
            </div>
        </div>
      </div>
    );
  }  

  // // active component 1
  // renderLoading = () => {
  //   return <LoadingSpinner />;
  // };

  // active component 2
  renderEditDistrict = () => {
    const voter = this.context.user;
    const location = {
      streetNo: voter._doc.location.street.number,
      streetName: voter._doc.location.street.name,
      city: voter._doc.location.city,
      province: voter._doc.location.state,
      postcode: voter._doc.location.postcode
    };
  
    return <EditDistrict location={location}/>;
  };

  
  // active component 3
  renderViewCandidates = () => {
    return <ViewCandidates />;
  }


  // active component 4
  renderVote = () => {
    return <Vote />;
  }

  renderActiveComponent = () => {
    switch(this.state.activeComponentId) {
      case(4): {
        return this.renderVote();
      }

      case(3): {
          return this.renderViewCandidates();
      }

      case(2): {
        return this.renderEditDistrict();
      }

      // case(1): {
      //     return this.renderLoading();
      // }

      case(0):
      default: {
          return this.renderDefault();
      }
    }
  };

  render() {
    return this.renderActiveComponent();
  }
};
Landing.contextType = UserContext;

export default Landing;

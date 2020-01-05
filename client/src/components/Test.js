import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./style.css";
import mapboxgl from 'mapbox-gl';

// Because any key embedded in the .env file will be included in the build, 
// which reveals an API key that we eon't want revealed, 
//import "../mapboxAPIKey.js"; // when testing locally

// when deploying to Heroku or GitHub
mapboxgl.accessToken = "pk.eyJ1IjoiZXNjaGVyZmFuIiwiYSI6ImNrNHl4bGszeDA1Z2MzZXM3enl3dXAwdGQifQ.GQLGYq0XDlXApqGgkKqF2A";


const ottawa = {
  latitude: 45.416667,
  longitude: -75.7
}

const toronto = {
  latitude: 43.70011,
  longitude: -79.4163
}

// This component exists only to test mapbox's access with an API key.
class Test extends Component {
  // Setting the component's initial state
  state = {
    map: null
  };

  componentDidMount() {
    // Is this the component with the map?
    const location = toronto;
    console.log("access token is ", mapboxgl.accessToken);

    const newMap = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [location.longitude, location.latitude],
      zoom: 12
    });
    this.setState({ map: newMap });
  }

  componentDidUpdate() {
    const location = ottawa;
    this.state.map.setCenter([location.longitude, location.latitude]);
  }
  
  renderMap = () => {
    return (
      <div className="container-fluid full-screen">
        <div className="row">
           <div ref={el => this.mapContainer = el} className="col mapContainer" />
        </div>
      </div>
    );
  }  

  render() {
    return this.renderMap();
  }
};
Test.contextType = UserContext;

export default Test;

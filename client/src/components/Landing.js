import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./style.css";
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

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
      const voter = this.context.user;
      const log = this.context.log;
      const voterLatitude = voter.location.coordinates.latitude;
      const voterLongitude = voter.location.coordinates.longitude;
      const districtBoundaries = voter.location.districtBoundaries;
      log.debug("Landing componentDidMount voter location is ", voter.location);

      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [voterLongitude, voterLatitude],
        zoom: 12
      });

      log.trace("Landing componentDidMount district boundaries are ", districtBoundaries);

      newMap.on('load', () => {
        newMap.addLayer({
          'id': voter.location.district,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': districtBoundaries
            }
          },
          'layout': {},
          'paint': {
            'fill-color': '#D3D3D3',
            'fill-opacity': 0.8
          }
        });
      });

      this.setState({ map: newMap });
    }
  }

  componentDidUpdate() {
    if(this.state.activeComponentId === 0) {
      let voter = this.context.user;
      const voterLatitude = voter.location.coordinates.latitude;
      const voterLongitude = voter.location.coordinates.longitude;

      this.state.map.setCenter([voterLongitude, voterLatitude]);
    }
  }
  
  renderDefault = () => {
    let voter = this.context.user;
    return (
      <div className="container-fluid full-screen">
        <div className="row">
            <div className="col-8 col-sm-9 mt-3 ml-3 bg-white text-center pt-2 mapFormWidget">
                Your district is {voter.location.district}
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
                    onClick={ () => { 
                      this.setState({ activeComponentId: 4 })}} disabled={voter.hasvoted==='true'}>
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
    return <EditDistrict location={voter.location}/>;
  };

  
  // active component 3
  renderViewCandidates = () => {
    return <ViewCandidates log={this.context.log}/>;
  }


  // active component 4
  renderVote = () => {
    return <Vote log={this.context.log}/>;
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

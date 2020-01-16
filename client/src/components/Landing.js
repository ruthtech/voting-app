import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./assets/css/style.css";
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import EditDistrict from "./EditDistrict";
import ViewCandidates from './ViewCandidates';
import Vote from './Vote';
import log from "loglevel";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

const ottawaLat = 45.416667;
const ottawaLong = -75.7;

class Landing extends Component {
  state = {
    activeComponentId: 0,
    map: null
  };

  district = ""; // If the district changes, the map needs a new layer added and then the map needs to be refreshed. 

  componentDidMount() {
    if(this.state.activeComponentId === 0) {
      const voter = this.context.user;
      const log = this.context.log;
      const voterLatitude = voter.location.coordinates.latitude;
      const voterLongitude = voter.location.coordinates.longitude;
      log.debug("Landing componentDidMount voter location is ", voter.location);

      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [voterLongitude, voterLatitude],
        zoom: 12
      });

      // Unfortunately the DOM must be rendered before we can create the map 
      // (and set the state) because it's a mapbox requirement that the DOM container 
      // must exist and be passed in to create the map.
      this.setState({ map: newMap, district: voter.location.district}); // districtUpdated can be safely set to false because by this time the new district has been added as a layer to the map
    }
  }

  componentDidUpdate() {
    // If the voter's new address is in a different voting district, add the new voting district shaded area
    // to the map and centre on it.
    const voter = this.context.user;
    if((this.state.map !== null) && (this.state.map.isSourceLoaded)) {
      const voterLatitude = voter.location.coordinates.latitude;
      const voterLongitude = voter.location.coordinates.longitude;

      this.state.map.setCenter([voterLongitude, voterLatitude]);

      if(this.districtChanged(voter.location.district)) {
        let districtLayerId = voter.location.district.replace(/\s/g, "");
        // When constructing a mapbox map, the first time that you create a style
        // and a layer, you may listen to the 'load' event and add the layer during that
        // event. This ensures that the style has finished loading before you change
        // it by adding a new layer.
        // 
        // When adding layers dynamically to a mapbox style, listen to the 'data' event
        // and add the new layers during that event because the load event is only 
        // fired once during the map lifespan. This also works for adding the first
        // layer and omitting the "add layer" for the "load" event means that we 
        // have only the code below to maintain.
        this.state.map.on('data', () => {
          if(this.state.map.getLayer(districtLayerId) === undefined) {
            this.state.map.addLayer({
              'id': districtLayerId,
              'type': 'fill',
              'source': {
                'type': 'geojson',
                'data': {
                  'type': 'Feature',
                  'geometry': voter.location.districtBoundaries
                }
              },
              'layout': {},
              'paint': {
                'fill-color': '#D3D3D3',
                'fill-opacity': 0.8
              }
            });
          };

          this.district = voter.location.district;
        });
      }
    }
  }

  districtChanged(newDistrict) {
    return this.district !== newDistrict;
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
    return <EditDistrict location={voter.location} />;
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

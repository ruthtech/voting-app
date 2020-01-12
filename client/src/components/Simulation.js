import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./style.css";
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import ottawaCentreDistrictBoundaries from './assets/geoJSON/ottawaCentreDistrictBoundaries';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

const ottawaLat = 45.416667;
const ottawaLong = -75.7;
const ottawaLayerId = "OttawaCentre"
const grey = '#D3D3D3';

const pcParty = '#244982';
const greenParty = '#4e9a2f';
const blocQuebecois = '#143d73';
const liberal = '#cd2003';
const ndp = '#ec8200';
const neonPink = "#FF6EC7"; // independent or not one of the major parties
const partyColours = [
  pcParty,
  greenParty,
  blocQuebecois,
  liberal,
  ndp,
  neonPink
];

class Simulation extends Component {
  state = {
    map: null
  };

  componentDidMount() {
      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [ottawaLong, ottawaLat],
        zoom: 12
      });

      newMap.on('load', () => {
        newMap.addLayer({
          'id': ottawaLayerId,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': ottawaCentreDistrictBoundaries
            }
          },
          'layout': {},
          'paint': {
            'fill-color': grey,
            'fill-opacity': 0.8
          }
        });
      });

      this.setState({ map: newMap });
  }

  componentDidUpdate() {
    //   let voter = this.context.user;
    //   const voterLatitude = voter.location.coordinates.latitude;
    //   const voterLongitude = voter.location.coordinates.longitude;

    this.state.map.setCenter([ottawaLong, ottawaLat]);
  }
  
  renderMap = () => {
    return (
      <div className="container-fluid full-screen">
        <div className="row">
           <div ref={el => this.mapContainer = el} className="col mapContainer" />
        </div>
        <div className="row pb-3">
            <div className="col">
                <Button variant="secondary w-100" 
                    onClick={ () => { this.renderResetSimulation(); }} >
                    Reset</Button>
            </div>
            <div className="col">
                <Button variant="secondary w-100"
                    onClick={ () => { this.renderSimulation()}} >
                    Simulate</Button>
            </div>
        </div>
      </div>
    );
  }  

  randomColour = () => {
    const log = this.context.log;
    log.warn("generate a random party colour as the winner");
    // Generate a random number between 0 and partyColours.length-1
    // Math.floor will round down, meaning we would get a number between 0 and the length
    // Math.ceil would round up, meaning a number between 1 and partyColours.length
    var partyColoursIndex = Math.floor(Math.random() * (partyColours.length));
    return partyColours[partyColoursIndex];
  }

  // Run the simulation
  renderSimulation = () => {
    // Pretend that a simulation has been run. For now just change the fill colour of the one district.
    this.state.map.setPaintProperty(ottawaLayerId, 'fill-color', this.randomColour());
  };
  
  // "Undo" the simulation. Reset all votes to null and regenerate the map.
  renderResetSimulation = () => {
    this.state.map.setPaintProperty(ottawaLayerId, 'fill-color', grey);    
  }

  render() {
    return this.renderMap();
  }
};
Simulation.contextType = UserContext;

export default Simulation;

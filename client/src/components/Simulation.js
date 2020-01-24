import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./assets/css/style.css";

import ReactDOM from 'react-dom';
import Tooltip from './tooltip';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

const ottawaLat = 45.416667;
const ottawaLong = -75.7;
const winnipegLat = 49.900501;
const winnipegLong = -97.139313;

// To get the parties' colour as a hex value, we took a screen capture of their 
// web site, imported it into GIMP, used the eyedropper and recorded the hex.
const pcParty = '#244982';
const greenParty = '#4e9a2f';
const blocQuebecois = '#143d73';
const liberalParty = '#cd2003';
const ndp = '#ec8200';
const neonPink = "#FF6EC7"; // Independent
const neonYellow = "#CCFF00"; // Less known party. See https://www.elections.ca/content.aspx?section=pol&dir=par&document=index&lang=e
const grey = '#D3D3D3'; // 'Before vote' (reset) colour

class Simulation extends Component {
  // If something is loading in the background, such as district boundaries or the simulation is running, 
  // isLoading=true means show the loading spinner and disable the buttons.
  state = {
    map: null,
    isLoading: true
  };

  tooltipContainer;
  tooltipReference; // keep track of the old tooltip and destroy it before allocating another one. 

  constructor(props) {
    super(props);
  }

  setTooltip(features) {
    // Release the memory used by the last tooltip because we use only one tooltip at a time.
    ReactDOM.unmountComponentAtNode(document.getElementById('mapbox-tooltip'));

    // Then allocate the new tooltip
    this.tooltipReference = ReactDOM.render(
      <Tooltip features={features}/>,
      this.tooltipContainer
    );
  }

  componentDidMount() {
    // On load show a blank map. 
    try {
      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [ottawaLong, ottawaLat],
        zoom: 4
      });

      // Container to put React generated content in.
      this.tooltipContainer = document.createElement('div');
      this.tooltipContainer.setAttribute('id', 'mapbox-tooltip');
      const tooltip = new mapboxgl.Marker(
        this.tooltipContainer, {
        offset: [-25, 0]
      });
      tooltip.setLngLat([0,0]);
      tooltip.addTo(newMap);
      
      
      // Load the data to populate the map with districts
      axios({
        method: 'get',
        url: `/api/v1/districts`
      })
      .then( response => {
        let districts = response.data;

        for(let i=0; i<districts.length; i++) {
          const district = districts[i];
          this.addLayer(district, newMap);
        }

        newMap.on('mousemove', (e) => {
          const features = newMap.queryRenderedFeatures(e.point);
          tooltip.setLngLat(e.lngLat);

          // We want to render a tooltip only for the voting district layer information.
          let votingFeature = features.filter((feature) => {
            if(feature.layer.metadata == null) return false;
            return (feature.layer.metadata.votingDistrict !== undefined);
          });

          newMap.getCanvas().style.cursor = (votingFeature.length > 0) ? 'pointer' : '';
      
          // Don't check if the votingFeature isn't found (e.g. when the mouse isn't over Canada).
          // Instead, tell the tooltip to render an empty div.
          this.setTooltip(votingFeature);      
        });
  
        // Create a data change to trigger the layer render.
        newMap.setCenter([winnipegLong, winnipegLat]);
        this.setState({isLoading: false});
      })
      .catch ( error => {
        this.props.log.error("Simulation componentDidMount. Error while retrieving districts for simulation");
        this.props.log.error(error);
        this.setState({isLoading: false});
      });

      // load the districts with an axios call and save them to state
      this.setState({ map: newMap });  
    } catch ( error ) {
      this.props.log.error("Error while creating blank map for simulation");
      this.props.log.error(error);
    }
  }

  componentWillUnmount() {
    // Remove every created DOM node. and destroy the map. Destroying the map
    // will remove the event listeners on the map.
    try {
      this.tooltipContainer.remove();
      this.state.map.destroy();
    } catch ( error ) {
      this.props.log.error("Error while freeing resources in componentWillUnmount");
      this.props.log.error(error);
    }
  }

  getPartyColour(partyName) {
    switch(partyName) {
      case('Independent'): {
        return neonPink;
      }

      case('Conservative Party of Canada'): {
        return pcParty;
      }

      case('Green Party of Canada'): {
        return greenParty;
      }

      case('Liberal Party of Canada'): {
        return liberalParty;
      }

      case('New Democratic Party'): {
        return ndp;
      }

      case('Bloc Québécois'):
      case('Bloc Qu�b�cois'): {
        return blocQuebecois;
      }
        
      default: {
        // One of the other parties documented on https://www.elections.ca/content.aspx?section=pol&dir=par&document=index&lang=e
        // For example the 'Animal Protection Party of Canada' or -- not kidding -- the 'Pirate Party of Canada'. 
        this.props.log.trace("Seat won by ", partyName);
        return neonYellow;
      }
    }
  }

  getDistrictLayerId(district) {
    return district.district_name.replace(/\s/g, "");
  }

  addLayer(district, map) {
    // Load this on data change, not on map load, because the map is loaded
    // before this method is called so that the user sees something instead
    // of a blank screen while the districts are loaded.
    map.on('data', () => {
      let districtLayerId = this.getDistrictLayerId(district);
      let votingSeat = (district.seat === null) ? 'Awaiting vote' : district.seat;
      let fillColor = (district.seat === null) ? grey : this.getPartyColour(district.seat);
      if(map.getLayer(districtLayerId) === undefined) {
        map.addLayer({
          'id': districtLayerId,
          'type': 'fill',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'geometry': district.location.districtBoundaries
            }
          },
          'metadata': {
            votingDistrict: district.district_name,
            votingSeat: votingSeat
          },
          'layout': {},
          'paint': {
            'fill-color': fillColor,
            'fill-opacity': 0.8
          }
        });
      };
    });
  }

  // Run the simulation and then get the 'winning' party to determine which colour to use on the map.
  renderSimulation = () => {
    this.setState({isLoading: true});
    axios({
      method: 'put',
      url: `/api/v1/simulation/run`
    })
    .then( response => {
      let districts = response.data;
      for(let i=0; i<districts.length; i++) {
        let district = districts[i];
        let districtLayerId = this.getDistrictLayerId(district);
        let partyColour = this.getPartyColour(district.seat);
        if(this.state.map.getLayer(districtLayerId) !== undefined) {
          this.state.map.getLayer(districtLayerId).metadata.votingSeat = district.seat;
          this.state.map.setPaintProperty(districtLayerId, 'fill-color', partyColour);
        }
      }
      this.setState({isLoading: false});
    })
    .catch( error => {
      this.props.log.error("Error while running simulation");
      this.props.log.error(error);
      this.setState({isLoading: false});
    });
  };
  
  // "Undo" the simulation. Reset all votes to null and recolour the districts on the map.
  resetSimulation = () => {
    this.setState({isLoading: true});
    axios({
      method: 'put',
      url: `/api/v1/simulation/reset`
    })
    .then( response => {
      let districts = response.data;
      for(let i=0; i<districts.length; i++) {
        let district = districts[i];
        let districtLayerId = this.getDistrictLayerId(district);
        if(this.state.map.getLayer(districtLayerId) !== undefined) {
          this.state.map.getLayer(districtLayerId).metadata.votingSeat = 'Awaiting vote';
          this.state.map.setPaintProperty(districtLayerId, 'fill-color', grey);
        }
      }
      this.setState({isLoading: false});
  })
    .catch( error => {
      this.props.log.error("Error while resetting simulation");
      this.props.log.error(error);
      this.setState({isLoading: false});
    });
  }

  render() {
    const loadingClass = (this.state.isLoading) ? ' bold ' : ' hide';
    return (
      <div className="container-fluid full-screen">
        <div className="row">
           <div ref={el => this.mapContainer = el} className="col mapContainer" />
        </div>
        <div className={'row d-flex justify-content-center' + loadingClass}>
           <i className='fa fa-spinner fa-spin' />
           <span className='w-80 pl-2 text-center'>Loading...</span>
        </div>
        <div className="row pb-3">
            <div className="col">
                <Button variant="secondary w-100" 
                    onClick={ () => { this.resetSimulation(); }} disabled={this.state.isLoading}>
                    Reset Vote</Button>
            </div>
            <div className="col">
                <Button variant="secondary w-100"
                    onClick={ () => { this.renderSimulation()} } disabled={this.state.isLoading}>
                    Simulate Vote</Button>
            </div>
        </div>
      </div>
    );
  }
};
Simulation.contextType = UserContext;

export default Simulation;

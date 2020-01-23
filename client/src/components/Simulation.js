import React, { Component } from "react";
import UserContext from '../utils/UserContext';
import mapboxgl from 'mapbox-gl';
import Button from 'react-bootstrap/Button';
import axios from "axios";
import 'mapbox-gl/dist/mapbox-gl.css';
import "./assets/css/style.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_TOKEN;

const ottawaLat = 45.416667;
const ottawaLong = -75.7;
const winnipegLat = 49.900501;
const winnipegLong = -97.139313;
const grey = '#D3D3D3'; // 'Before vote' (reset) colour

const pcParty = '#244982';
const greenParty = '#4e9a2f';
const blocQuebecois = '#143d73';
const liberalParty = '#cd2003';
const ndp = '#ec8200';
const neonPink = "#FF6EC7"; // independent or not one of the major parties
const neonYellow = "#CCFF00"; // Unknown party. Should never happen.

class Simulation extends Component {
  // If something is loading in the background, such as district boundaries or the simulation is running, 
  // isLoading=true means show the loading spinner and disable the buttons.
  state = {
    map: null,
    isLoading: true
  };


  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // On load show a blank map. 
    try {
      const newMap = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [winnipegLong, winnipegLat],
        zoom: 6
      });
      
          // Load the data to populate the map with districts
      axios({
        method: 'get',
        url: `/api/v1/districts`
      })
      .then( response => {
        let districts = response.data;

        // TODO CHANGE. Adding all district layers at once has a major performance impact.
        // Figure out how to load shaded districts with less impact.
        //
        for(let i=0; i<districts.length; i++) {
          const district = districts[i];
          this.addLayer(district, newMap);
        }

        // Create a data change to trigger the layer render.
        newMap.setCenter([ottawaLong, ottawaLat]);
        this.setState({isLoading: false});
      })
      .catch ( error => {
        console.log("Simulation addDistrictsToMap. Error while retrieving districts for simulation");
        console.log(error);
        this.setState({isLoading: false});
      });

      // load the districts with an axios call and save them to state
      this.setState({ map: newMap });  
    } catch ( error ) {
      console.log("Error while creating blank map for simulation");
      console.log(error);
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
        console.log("Unknown party ", partyName);
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
          'layout': {},
          'paint': {
            'fill-color': grey,
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
        if(this.state.map.getLayer(districtLayerId) === undefined) {
          // Shouldn't happen. Log a warning.
          console.log("TODO TEMP no layer["+ i + "] for ", districtLayerId);
        }
        else {
          // console.log("found layer["+ i + "] " + districtLayerId + " and changing its colour to " + partyColour);
          this.state.map.setPaintProperty(districtLayerId, 'fill-color', partyColour);
        }
      }
      this.setState({isLoading: false});
    })
    .catch( error => {
      console.log("Error while running simulation");
      console.log(error);
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
      console.log("Simulation reset districts length is ", districts.length);
      for(let i=0; i<districts.length; i++) {
        let district = districts[i];
        let districtLayerId = this.getDistrictLayerId(district);
        this.state.map.setPaintProperty(districtLayerId, 'fill-color', grey);
      }
      this.setState({isLoading: false});
  })
    .catch( error => {
      console.log("Error while resetting simulation");
      console.log(error);
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
                    Reset</Button>
            </div>
            <div className="col">
                <Button variant="secondary w-100"
                    onClick={ () => { this.renderSimulation()} } disabled={this.state.isLoading}>
                    Simulate</Button>
            </div>
        </div>
      </div>
    );
  }
};
Simulation.contextType = UserContext;

export default Simulation;

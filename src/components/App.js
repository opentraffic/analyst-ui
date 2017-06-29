import React, { Component } from 'react';
import './App.css';
import Map from './Map'

class App extends Component {
  render() {
    const map = {
      center: [0,120],
      zoom: 3,

      // TODO: Pull out into config
      mapzen: {
        apiKey: 'mapzen-YFrX5jt'
      },

      // Temporary. Credentials ported from traffic-engine-app.
      mapbox: {
        accessToken: 'pk.eyJ1IjoiY29udmV5YWwiLCJhIjoiMDliQURXOCJ9.9JWPsqJY7dGIdX777An7Pw',
        mapId: 'conveyal.gepida3i'
      },
    }

    return (
      <div className="App">
        <Map className="map-container" map={map} />
      </div>
    );
  }
}

export default App;

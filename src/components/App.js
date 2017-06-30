import React, { Component } from 'react'
import Map from './Map'
import config from '../config'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map className="map-container" map={config} />
        <div className="sidebar" />
      </div>
    )
  }
}

export default App

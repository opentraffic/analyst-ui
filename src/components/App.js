import React, { Component } from 'react'
import Map from './Map'
import Sidebar from './Sidebar'
import config from '../config'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map className="map-container" map={config} />
        <Sidebar className="sidebar-container" />
      </div>
    )
  }
}

export default App

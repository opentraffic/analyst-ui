import React, { Component } from 'react'
import { Provider } from 'react-redux'

import Map from './Map'
import Sidebar from './Sidebar'
import DevTools from './DevTools'
import store from '../store'
import config from '../config'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Map className="map-container" config={config} />
          <Sidebar className="sidebar-container" />
          <DevTools />
        </div>
      </Provider>
    )
  }
}

export default App

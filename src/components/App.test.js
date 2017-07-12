/* global it */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Tangram } from '../test/mocks'

it('renders without crashing', () => {
  global.Tangram = Tangram
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

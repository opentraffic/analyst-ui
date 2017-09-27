/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import Map from './'
import { Tangram } from '../../test/mocks'

it('renders without crashing', () => {
  global.Tangram = Tangram
  const div = document.createElement('div')
  const config = {
    mapzen: { apiKey: 'foo' }
  }

  ReactDOM.render(<Map config={config} />, div)
})

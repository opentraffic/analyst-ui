/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { ModeSelect } from './index'

describe('ModeSelect', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<ModeSelect dispatch={jest.fn()} />, div)
  })
})

/* eslint-env jest */
import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import Legend from './index'

describe('Legend', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<Legend />, div)
  })

  it('renders rows of legend data', () => {
    const wrapper = shallow(<Legend />)
    expect(wrapper.find('tr').length).toEqual(10)
  })
})

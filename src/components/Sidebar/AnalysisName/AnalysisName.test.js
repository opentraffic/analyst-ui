/* eslint-env jest */
import React from 'react'
import { shallow, mount } from 'enzyme'
import { AnalysisName } from './index'

describe('AnalysisName', () => {
  it('renders a view name if provided', () => {
    const wrapper = shallow(<AnalysisName dispatch={jest.fn()} viewName="foo" />)
    expect(wrapper.find('.analysis-name').text()).toEqual('foo')
  })

  it('renders a placeholder string without a view name', () => {
    // For this test, explicitly set the `viewName` prop to a `null` value
    const wrapper = shallow(<AnalysisName dispatch={jest.fn()} viewName={null} />)
    expect(wrapper.find('.analysis-name').text()).toEqual('Untitled analysis')
  })

  it('renders an input box when editing the view name', () => {
    const wrapper = shallow(<AnalysisName dispatch={jest.fn()} />)

    // Input element should not be present before clicking the edit button
    const input1 = wrapper.find('input').node
    expect(input1).toBeUndefined()

    // Check the state
    expect(wrapper.state('isEditing')).toEqual(false)

    // For this test, simulate the click action to enable editing
    wrapper.find('Button').simulate('click')

    // Check that the state has changed
    expect(wrapper.state('isEditing')).toEqual(true)

    // Input element should be present now
    const input2 = wrapper.find('input').node
    expect(input2).toBeDefined()
  })

  it('renders a placeholder string inside the input box when editing (without a view name)', () => {
    const wrapper = mount(<AnalysisName dispatch={jest.fn()} />)

    // Usually, we prefer setting the state directly over simulating actions
    // so we'll only test the simulation once (in the previous test), for
    // subsequent tests, we'll set the editing state directly.
    wrapper.setState({ isEditing: true })

    // Make sure the placeholder is set
    const input = wrapper.find('input').node
    expect(input.placeholder).toEqual('Untitled analysis')

    // Initial value should be the same as the placeholder
    expect(input.value).toEqual('Untitled analysis')

    // Make sure that the input has been focused
    expect(input).toEqual(document.activeElement)
  })

  it('renders the current view name inside the input box when editing, if it exists', () => {
    const wrapper = mount(<AnalysisName dispatch={jest.fn()} viewName="foo" />)

    wrapper.setState({ isEditing: true })

    const input = wrapper.find('input').node
    expect(input.value).toEqual('foo')

    // Make sure that the input has been focused.
    expect(input).toEqual(document.activeElement)

    // TODO: test if input.select() has been called.
    // `window.getSelection()` isn't supported in jsdom (yet) so that won't
    // work, and we can't set a spy on an element that hasn't been created,
    // so I'm not sure how to test this yet.
  })

  it('saves the view name when Save button is clicked', () => {
    const mockDispatch = jest.fn()
    const wrapper = mount(<AnalysisName dispatch={mockDispatch} viewName="foo" />)

    // Edit the input to a new value
    wrapper.setState({ isEditing: true })
    const input = wrapper.find('input').node
    input.value = 'baz'

    // Simulate a click on the Save button
    wrapper.find('Button').first().simulate('click')

    // Check that the state has changed
    expect(wrapper.state('isEditing')).toEqual(false)

    // Check that the value has been sent to the dispatch
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_ANALYSIS_NAME', viewName: 'baz'
    })
  })

  it('saves the view name when form is submitted', () => {
    const mockDispatch = jest.fn()
    const wrapper = mount(<AnalysisName dispatch={mockDispatch} viewName="foo" />)

    // Edit the input to a new value
    wrapper.setState({ isEditing: true })
    const input = wrapper.find('input').node
    input.value = 'baz'

    // Simulate a click on the Save button
    wrapper.find('form').simulate('submit')

    // Check that the state has changed
    expect(wrapper.state('isEditing')).toEqual(false)

    // Check that the value has been sent to the dispatch
    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_ANALYSIS_NAME', viewName: 'baz'
    })
  })

  it('reverts to the old view name when Cancel button is clicked', () => {
    const mockDispatch = jest.fn()
    const wrapper = mount(<AnalysisName dispatch={mockDispatch} viewName="foo" />)

    // Edit the input to a new value
    wrapper.setState({ isEditing: true })
    const input = wrapper.find('input').node
    input.value = 'baz'

    // Simulate a click on the Cancel button
    wrapper.find('Button').last().simulate('click')

    // Check that the state has changed
    expect(wrapper.state('isEditing')).toEqual(false)

    // Check that the value has not been sent to the dispatch
    expect(mockDispatch).toHaveBeenCalledTimes(0)
  })
})

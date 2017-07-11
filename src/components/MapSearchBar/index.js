import React from 'react'
import Autosuggest from 'react-autosuggest'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import './MapSearchBar.css'

class MapSearchBar extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      value: '',
      placeholder: 'Search for an address or a place',
      suggestions: [],
    }

    this.onChangeAutosuggest = this.onChangeAutosuggest.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.changeCenterMap = this.changeCenterMap.bind(this)
  }

  // Will be called every time you need to recalculate suggestions
  onSuggestionsFetchRequested({value}) {
    if (value.length >= 2) {
      this.autocomplete(value)
    }
  }

  // Will be called every time you need to set suggestions to []
  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    })
  }

  // Teach Autosuggest what should be input value when suggestion is clicked
  getSuggestionValue(suggestion) {
    const lat = suggestion.geometry.coordinates[1]
    const lng = suggestion.geometry.coordinates[0]
    const latlng = [lat, lng]

    this.props.dispatch({
      type: 'SET_LOCATION',
      latlng: latlng,
      name: suggestion.properties.label
    })

    this.changeCenterMap(latlng)
    return suggestion.properties.label
  }

  // Change center of map when suggestion is selected
  changeCenterMap(newCenter) {
    // latitude is the second number in array, not first
    this.props.dispatch({
      type: 'CHANGE_CENTER',
      coordinates: newCenter
    })
  }

  renderSuggestion(suggestion, {query, isHighlighted}) {
    const label = suggestion.properties.label
    return (
      <div className="map-search-suggestion-item">
        <i aria-hidden="true" className="marker icon"></i> {label}
      </div>
    )
  }

  onChangeAutosuggest(event, {newValue, method}) {
    this.setState({
      value: newValue
    })
  }

  //Makes autocomplete request to Mapzen Search based on what user has typed
  autocomplete(query) {
    const endpoint = `https://search.mapzen.com/v1/autocomplete?text=${query}&api_key=${this.props.config.mapzen.apiKey}`
    this.makeRequest(endpoint)
  }

  makeRequest(endpoint) {
    window.fetch(endpoint)
      .then(response => response.json())
      .then((results) => {
        this.setState({
          suggestions: results.features
        })
      })
  }

  render() {
    const inputProps = {
      placeholder: this.state.placeholder,
      value: this.state.value,
      onChange: this.onChangeAutosuggest,
    }

    return (
      <div className="map-search-panel">
        <div className="search-icon">
          <i aria-hidden="true" className="search icon"></i>
        </div>
        <Autosuggest
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
      </div>
    )
  }
}

export default connect()(MapSearchBar)

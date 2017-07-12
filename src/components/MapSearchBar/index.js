import React from 'react'
import Autosuggest from 'react-autosuggest'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import './MapSearchBar.css'

class MapSearchBar extends React.Component {
  static propTypes = {
     setLocation: PropTypes.func.isRequired,
     recenterMap: PropTypes.func.isRequired,
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
    this.makeRequest = this.makeRequest.bind(this)
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
    const name = suggestion.properties.label

    // Stores latlng and name of selected location in Redux
    this.props.setLocation(latlng, name)
    // Recenters map to the selected location's latlng
    this.props.recenterMap(latlng)
    return suggestion.properties.label
  }

  renderSuggestion(suggestion, {query, isHighlighted}) {
    const label = suggestion.properties.label

    // Highlight the input query
    const r = new RegExp(`(${query})`, 'gi')
    const highlighted = label.split(r)
    for (let i = 0; i < highlighted.length; i++) {
      if (highlighted[i].toLowerCase() === query.toLowerCase()) {
        highlighted[i] = <strong key={i}>{highlighted[i]}</strong>
      }
    }

    return (
      <div className="map-search-suggestion-item">
        <i aria-hidden="true" className="marker icon"></i>{highlighted}
      </div>
    )
  }

  onChangeAutosuggest(event, {newValue, method}) {
    this.setState({
      value: newValue
    })
  }

  // Makes autocomplete request to Mapzen Search based on what user has typed
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
        <Icon name="search" className="search-icon" /> 
        <Autosuggest
          ref={(ref) => {this.autosuggestBar = ref}}
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

export default MapSearchBar

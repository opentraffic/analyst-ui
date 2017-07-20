import React from 'react'
import Autosuggest from 'react-autosuggest'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { throttle } from 'lodash'
import { updateURL, parseQueryString } from '../../url-state'
import './MapSearchBar.css'

class MapSearchBar extends React.Component {
  static propTypes = {
    setLocation: PropTypes.func.isRequired,
    recenterMap: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      value: '',
      placeholder: 'Search for an address or a place',
      suggestions: []
    }

    this.throttleMakeRequest = throttle(this.makeRequest, 250)
    this.onChangeAutosuggest = this.onChangeAutosuggest.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.makeRequest = this.makeRequest.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.renderClearButton = this.renderClearButton.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount () {
    // Not sure if right lifecycle
    // If queryString has value for label, set value on MapSearchBar
    const newValue = parseQueryString('label')
    if (newValue !== null) {
      this.setState({
        value: newValue
      })
    }
  }

  // Will be called every time you need to recalculate suggestions
  onSuggestionsFetchRequested ({value}) {
    if (value.length >= 2) {
      this.autocomplete(value)
    }
  }

  // Will be called every time you need to set suggestions to []
  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  }

  // Teach Autosuggest what should be input value when suggestion is clicked
  getSuggestionValue (suggestion) {
    return suggestion.properties.label
  }

  // Will be called every time suggestion is selected via mouse or keyboard
  onSuggestionSelected (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) {
    event.preventDefault()
    const lat = suggestion.geometry.coordinates[1]
    const lng = suggestion.geometry.coordinates[0]
    const latlng = [lat, lng]

    // Stores latlng and name of selected location in Redux
    this.props.setLocation(latlng, suggestionValue)
    // Recenters map to the selected location's latlng
    const zoom = this.props.config.map.zoom
    // If user is below zoom 10, set to 10
    if (zoom < 10) {
      this.props.recenterMap(latlng, 10)
    } else {
      this.props.recenterMap(latlng, zoom)
    }

    // Updating URL to represent new lat/lng coordinates and new label
    const centerParams = {
      lat: lat,
      lng: lng,
      label: suggestionValue
    }
    updateURL(centerParams)
  }

  renderSuggestion (suggestion, {query, isHighlighted}) {
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
        <Icon name="marker" />{highlighted}
      </div>
    )
  }

  onChangeAutosuggest (event, {newValue, method}) {
    this.setState({
      value: newValue
    })
  }

  // Makes autocomplete request to Mapzen Search based on what user has typed
  autocomplete (query) {
    const endpoint = `https://search.mapzen.com/v1/autocomplete?text=${query}&api_key=${this.props.config.mapzen.apiKey}`
    this.throttleMakeRequest(endpoint)
  }

  // Makes search request based on what user has entered
  search (query) {
    const endpoint = `https://search.mapzen.com/v1/search?text=${query}&api_key=${this.props.config.mapzen.apiKey}`
    this.throttleMakeRequest(endpoint)
  }

  makeRequest (endpoint) {
    window.fetch(endpoint)
      .then(response => response.json())
      .then((results) => {
        this.setState({
          suggestions: results.features
        })
      })
  }

  // Clear button only appears when there's more than two characters in input
  renderClearButton (value) {
    if (value.length > 2) {
      return (
        <Icon name="close" className="clear-search" onClick={this.clearSearch} />
      )
    }
  }

  clearSearch (event) {
    // set state value back to empty string
    this.setState({
      value: ''
    })
    // clears suggestions
    this.onSuggestionsClearRequested()
  }

  // Now Autosuggest component is wrapped in a form so that when 'enter' is pressed, suggestions container is not closed automatically
  // Instead search results are returned in suggestions container
  handleSubmit (event) {
    event.preventDefault()
    const inputValue = this.autosuggestBar.input.value
    this.search(inputValue)
  }

  render () {
    const inputProps = {
      placeholder: this.state.placeholder,
      value: this.state.value,
      onChange: this.onChangeAutosuggest
    }

    const inputVal = this.state.value

    return (
      <div className="map-search-panel">
        <Icon name="search" className="search-icon" />
        {this.renderClearButton(inputVal)}
        <form onSubmit={this.handleSubmit}>
          <Autosuggest
            ref={(ref) => { this.autosuggestBar = ref }}
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            onSuggestionSelected={this.onSuggestionSelected}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
        </form>
      </div>
    )
  }
}

export default MapSearchBar

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'

class ETAView extends React.Component {
  static propTypes = {
    baselineTime: PropTypes.number,
    trafficRouteTime: PropTypes.number
  }

  render () {
    return (
      <Segment>
        <Header as="h3">ETA</Header>
        <p>{this.props.baselineTime}</p>
        <p>{this.props.trafficRouteTime}</p>
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    baselineTime: state.route.baselineTime,
    trafficRouteTime: state.route.trafficRouteTime
  }
}

export default connect(mapStateToProps)(ETAView)

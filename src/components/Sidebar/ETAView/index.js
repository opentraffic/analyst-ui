import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header } from 'semantic-ui-react'
import humanizeDuration from 'humanize-duration'

class ETAView extends React.Component {
  static propTypes = {
    baselineTime: PropTypes.number,
    trafficRouteTime: PropTypes.number
  }

  render () {
    if (this.props.baselineTime && this.props.trafficRouteTime) {
      const baselineTimeToDisplay = humanizeDuration(this.props.baselineTime * 1000, { round: true })
      const trafficRouteTimeToDisplay = humanizeDuration(this.props.trafficRouteTime * 1000, { round: true })
      return (
        <Segment>
          <Header as="h3">Route time</Header>
          <p><strong>Given speed limits</strong>: {baselineTimeToDisplay}</p>
          <p><strong>Given measured traffic</strong>: {trafficRouteTimeToDisplay}</p>
        </Segment>
      )
    }

    return null
  }
}

function mapStateToProps (state) {
  return {
    baselineTime: state.route.baselineTime,
    trafficRouteTime: state.route.trafficRouteTime
  }
}

export default connect(mapStateToProps)(ETAView)

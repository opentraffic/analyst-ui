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
    if (this.props.baselineTime && this.props.trafficRouteTime) {
      return (
        <Segment>
          <Header as="h3">Route time</Header>
          <p><strong>Baseline time</strong> {this.props.baselineTime}s</p>
          <p><strong>Traffic route time</strong> {this.props.trafficRouteTime.toFixed(2)}s</p>
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

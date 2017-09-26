import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import { exportData } from '../../../lib/exporter'

class ExportData extends React.Component {
  static propTypes = {
    geoJSON: PropTypes.object,
    name: PropTypes.string
  }

  onClickButton = (event) => {
    exportData(this.props.geoJSON, this.props.name)
  }

  render () {
    return (
      <Segment>
        <Header as="h3">Export</Header>
        <Button icon="download" content="Download" color="blue" fluid onClick={this.onClickButton} />
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    geoJSON: state.view.geoJSON,
    name: state.app.viewName
  }
}

export default connect(mapStateToProps)(ExportData)

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button, Icon } from 'semantic-ui-react'
import { exportData } from '../../../lib/exporter'
import './ExportData.css'

class ExportData extends React.Component {
  static propTypes = {
    geoJSON: PropTypes.object,
    analysisName: PropTypes.string,
    analysisMode: PropTypes.string,
    date: PropTypes.object,
    route: PropTypes.object,
    refSpeedComparisonEnabled: PropTypes.bool
  }

  constructor (props) {
    super(props)

    this.state = {
      message: null
    }
  }

  onClickButton = (format) => {
    const result = exportData(this.props.geoJSON, this.props.analysisName, format, this.props.analysisMode, this.props.date, this.props.refSpeedComparisonEnabled, this.props.route)
    if (result === false) {
      this.setState({
        message: 'There is no data to download.'
      })
    } else {
      this.setState({
        message: null
      })
    }
  }

  render () {
    const message = (this.state.message) ? <p className="export-message">{this.state.message}</p> : null

    return (
      <Segment>
        <div>
          <Header as="h3">Export</Header>
          <a href="https://github.com/opentraffic/analyst-ui/wiki/Export-Query-Results" target="_blank" rel="noopener noreferrer"><Icon circular color="grey" name="info" className="info-icon" title="Learn more about export formats" /></a>
        </div>
        <Button.Group fluid basic>
          <Button icon="download" content="Download as GeoJSON" color="blue" onClick={() => this.onClickButton('geojson')} />
          <Button icon="download" content="Download as CSV" color="blue" onClick={() => this.onClickButton('csv')} />
        </Button.Group>
        {message}
      </Segment>
    )
  }
}

function mapStateToProps (state) {
  return {
    geoJSON: state.view.geoJSON,
    analysisName: state.app.viewName,
    analysisMode: state.app.analysisMode,
    date: state.date,
    route: state.route,
    refSpeedComparisonEnabled: state.app.refSpeedComparisonEnabled
  }
}

export default connect(mapStateToProps)(ExportData)

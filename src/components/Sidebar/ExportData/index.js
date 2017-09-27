import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Segment, Header, Button } from 'semantic-ui-react'
import { exportData } from '../../../lib/exporter'
import './ExportData.css'

class ExportData extends React.Component {
  static propTypes = {
    geoJSON: PropTypes.object,
    name: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      message: null
    }
  }

  onClickButton = (event) => {
    const result = exportData(this.props.geoJSON, this.props.name)
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
        <Header as="h3">Export</Header>
        <Button icon="download" content="Download" color="blue" fluid onClick={this.onClickButton} />
        {message}
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

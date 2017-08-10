import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import './Loader.css'

class Loader extends React.Component {
  render () {
    const { isLoading } = this.props

    if (isLoading) {
      return(
        <div className='loading-indicator'>
          <Icon name='spinner' loading />
          <i> Loading... </i>
        </div>
      )
    }
    return null
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.loading.isLoading
  }
}

export default connect(mapStateToProps)(Loader)

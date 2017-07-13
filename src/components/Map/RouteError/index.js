import React from 'react'
import PropTypes from 'prop-types'
import { Message, Button } from 'semantic-ui-react'
import './RouteError.css'

const RouteError = (props) => {
  if (!props.message || props.message.trim().length === 0) return null

  return (
    <div className="route-error">
      <Message error>
        <Message.Header>Routing error</Message.Header>
        <p>
          <span className="route-error-message">{props.message}</span>
          <Button basic size="mini" onClick={props.onClick}>Dismiss</Button>
        </p>
      </Message>
    </div>
  )
}

RouteError.propTypes = {
  message: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

RouteError.defaultProps = {
  onClick: function () {}
}

export default RouteError

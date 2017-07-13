import React from 'react'
import { Message } from 'semantic-ui-react'

const ErrorMessage = (props) => (
  <Message error>
    <Message.Header>{props.header}</Message.Header>
    <p>{props.message}</p>
  </Message>
)

export default ErrorMessage

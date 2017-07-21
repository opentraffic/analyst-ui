// Polyfills
import 'string.prototype.padstart'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// Application
import './index.css'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()

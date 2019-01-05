import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as Sentry from '@sentry/browser'

Sentry.init({dsn: "https://0da9228f327747388edd92fd131a0295@sentry.io/1361927"})

ReactDOM.render(<App />, document.getElementById('root'))

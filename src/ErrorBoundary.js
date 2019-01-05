import React, { Component } from 'react'
import * as Sentry from '@sentry/browser'


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  render() {
    if (this.state.error) {
        return (
          <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>
        )
    } else {
        return this.props.children
    }
  }
}

export default ErrorBoundary

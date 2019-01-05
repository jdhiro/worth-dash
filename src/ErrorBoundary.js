import * as Sentry from '@sentry/browser'
import React, { Component } from 'react'
import { Button } from 'antd'


class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: false }
  }

  static getDerivedStateFromError(error) {
    return { error: true }
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
          <Button onClick={() => Sentry.showReportDialog()}>Report feedback</Button>
        )
    } else {
        return this.props.children
    }
  }
}

export default ErrorBoundary

import './Login.css';
import React, { Component } from 'react'
import { message, Alert, Button, Card, Col, Form, Icon, Input, Row } from 'antd'
import { wfetch, wpost, NetworkError, ResponseError } from './utils/wfetch'
import * as Sentry from '@sentry/browser'

const FormItem = Form.Item

class Login extends Component {

  state = {
    submitting: false
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.setState({ submitting: true })

    const form = this.props.form
    let v = null

    try {
      const values = await form.validateFields()
      v = {...values}
      // FIXME: This is a login hack to prevent the store from logging
      // into the UCL dashboard. Remove this after migration is complete.
      if (v.username === 'ucljuanita' || v.username === 'uclslater') {
        v = null
        message.info('Not a valid admin acount', 5)
      }
    } catch (err) {
      Sentry.captureException(err)
      this.setState({ submitting: false })
    }

    if (v !== null) {
      const urlParams = new URLSearchParams(Object.entries(v))
      try {
        const response = await wfetch({ path: `/auth?${urlParams}`, method: 'POST'})
        if (!response.ok) {
          throw new ResponseError('', response)
        } else {
          const responseBody = await response.json()
          sessionStorage.setItem('token', responseBody.token)
          this.props.history.push('/customer-search')
        }
      } catch (err) {
        if (err instanceof ResponseError) {
          if (err.res.status == 401) {
            message.info('Unauthorized username and password.', 5)
          } else if (err.res.status == 500) {
            message.info('Server error.', 5)
          }
        } else if (err instanceof NetworkError) {
          message.info('Network error, please check your connection.', 5)
        }
        Sentry.captureException(err)
        this.setState({ submitting: false })
      }
    }

  }

  render() {
    const { getFieldDecorator } = this.props.form
    const usernameOpts = {
      rules: [
        {
          required: true,
          message: 'Please enter your username.'
        }
      ]
    }
    const passwordOpts = {
      rules: [
        {
          required: true,
          message: 'Please enter your password.'
        }
      ]
    }

    return (
      <Row className='login-background' style={{ minHeight: '100vh' }} type='flex' justify='center' align='middle'>
        <Col span={8}>
          <center style={{ fontWeight: 100, color: 'white', fontSize: 'xx-large' }}>Welcome</center>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: 0, borderRadius: '15px' }}>
            <Form onSubmit={this.handleSubmit} className='login-form'>
              <FormItem>
                {getFieldDecorator('username', usernameOpts)(
                  <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} type='text' placeholder='Username' />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', passwordOpts)(
                  <Input prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} type='password' placeholder='Password' />
                )}
              </FormItem>
              <FormItem>
                <Button block type='primary' htmlType='submit'>
                  Sign In
                </Button>
              </FormItem>
            </Form>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Form.create()(Login)

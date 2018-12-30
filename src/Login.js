import './Login.css';
import React, { Component } from 'react'
import { message, Alert, Button, Card, Col, Form, Icon, Input, Row } from 'antd'
import { wfetch } from './utils/wfetch'

const FormItem = Form.Item

class LoginForm extends Component {
  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        const urlParams = new URLSearchParams(Object.entries(values))
        try {
          if (values.username === 'ucljuanita' || values.username === 'uclslater') {
            throw 'That is not a valid admin account.'
          }
          let response = await wfetch({ path: `/auth/login?${urlParams}`, method: 'POST'})
          if (response.ok) {
            const json = await response.json()
            sessionStorage.setItem('token', json.token)
            this.props.history.push('/customer-search')
          } else {
            throw 'Username and password do not match.'
          }
        } catch(err) {
          console.log(err)
          message.info(err, 5)
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Row className='login-background' style={{ minHeight: '100vh' }} type='flex' justify='center' align='middle'>
        <Col span={8}>
          <center style={{ fontWeight: 100, color: 'white', fontSize: 'xx-large' }}>Welcome</center>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', border: 0, borderRadius: '15px' }}>
            <Form onSubmit={this.handleSubmit} className='login-form'>
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: 'Please enter your username.' }],
                })(
                  <Input prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} type='text' placeholder='Username' />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please enter your password.' }],
                })(
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

const Login = Form.create()(LoginForm)

export default Login

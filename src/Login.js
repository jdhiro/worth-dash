import './Login.css';
import React, { Component } from 'react'
import { wfetch } from './utils/wfetch'

import { Form, Icon, Input, Button, Checkbox, Card, Row, Col } from 'antd'
const FormItem = Form.Item

class LoginForm extends React.Component {
  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        const urlParams = new URLSearchParams(Object.entries(values))
        try {
          let response = await wfetch({ path: `/auth/login?${urlParams}`, method: 'POST'})
          if (response.ok) {
            const json = await response.json()
            sessionStorage.setItem('token', json.token)
            this.props.history.push('/customer-search')
          }
        } catch(err) {
          console.log(err)
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


/*class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { username: '', password: '' }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const { username, password } = this.state
    const params = { username, password }
    const urlParams = new URLSearchParams(Object.entries(params))

    try {
      let response = await wfetch({ path: '/auth/login', method: 'POST'})
    } catch(err) {
      console.log(err)
    }

    try {
      let response = await fetch('http://0.0.0.0:8081/auth/login?' + urlParams, {
        method: 'POST'
      })
      if (response.ok) {
        let json = await response.json()
        sessionStorage.setItem('token', json.token)
        this.props.history.push('/customer-search')
      }
    } catch (err) {
      console.log(err)
    }
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type='text' name='username' value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type='text' name='password' value={this.state.password} onChange={this.handleChange} />
        </label>
        <input type='submit' value='Submit' />
      </form>
    )
  }
}*/

export default Login

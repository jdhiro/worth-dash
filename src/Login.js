import React, { useState } from 'react'
import { message, Button, Card, Col, Form, Input, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import * as Sentry from '@sentry/browser'
import ax from './utils/axios'

function Login(props) {

  const handleFinish = async values => {

    // FIXME: This is a login hack to prevent the store from logging
    // into the UCL dashboard. Remove this after migration is complete.
    if (values.username === 'ucljuanita' || values.username === 'uclslater') {
      message.info('Not a valid admin acount', 5)
      return
    }

    try {
      const response = await ax.post('/auth', values)
      sessionStorage.setItem('token', response.data.token)
      ax.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token
      props.history.push('/customer-search')
    } catch (e) {
      if (e.response.status === 401) message.info('Unauthorized username and password.', 5)
      else if (e.response.status === 500) message.info('Server error.', 5)
      else message.info('Network error, please check your connection.', 5)
      console.error(e.response.status)
      Sentry.captureException(e)
    }
  }

  return (
    <Row style={{ minHeight: '100vh' }} justify='space-around' align='middle'>
      <Col span={8}>
        <Card>
          <Form
            size={"large"}
            onFinish={handleFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your Username!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your Password!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  )

}

export default Login

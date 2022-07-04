import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Card, Col, Form, Input, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../auth'

/**
 * The login page.
 */
 function LoginPage() {
  let navigate = useNavigate()
  let location = useLocation()
  let auth = useAuth()

  let from = location.state?.from?.pathname ?? "/customer"

  const handleLogin = async (v) => {
    const { username, password } = v
    auth.login(username, password)
      .then(() => navigate(from, { replace: true }))
      .catch((e) => console.log(''))
  }
  return (
    <Row style={{ minHeight: '100vh' }} justify='space-around' align='middle'>
      <Col span={8}>
        <Card>
          <Form
            size={"large"}
            onFinish={handleLogin}
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

export default LoginPage
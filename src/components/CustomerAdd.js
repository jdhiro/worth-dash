import React, { useState } from 'react'
import { message, Form, Input, Button, Typography } from 'antd'
import http from '../utils/http'

const { Title } = Typography

function CustomerAdd(props) {

  const [form] = Form.useForm()

  let [submitting, setSubmitting] = useState(false)

  let handleFinish = async values => {
    console.log(values)
    const v = {...values}
    if (v.phonenumber !== undefined) {
      v.phonenumber = v.phonenumber.replace(/[^0-9]/g,'')
    }

    try {
      let response = await http.post('/customer', v)
      console.log(response.data)
      props.history.push(`/customer/${response.data.id}`)
    } catch(e) {
      message.error('There was an error creating the user.')
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Title>Add customer</Title>
      <Form onFinish={handleFinish} className='login-form' layout="vertical">
        
        <Form.Item label="First name" name="firstname" rules={[{ required: true, pattern: /^[A-z-']+$/, message: 'Please enter a first name.', whitespace: true }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Last name" name="lastname" rules={[{ required: true, pattern: /^[A-z-']+$/, message: 'Please enter a last name.', whitespace: true }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Phone number" name="phonenumber" rules={[{ required: false, type: 'string', pattern: /^[0-9-]+$/, message: 'Please enter a valid phone number.' }]}>
            <Input />
        </Form.Item>

        <Form.Item label="Email address" name="email" rules={[{ required: false, type: 'email', message: 'Please enter a valid email.' }]}>
            <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" loading={submitting}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  )

}

export default CustomerAdd

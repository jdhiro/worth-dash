import React, { Component } from 'react'
import { message, Form, Input, Tooltip, Icon, Button, Layout, Row, Col, Select, Checkbox, Cascader, AutoComplete } from 'antd'
import queryString from 'query-string'
import { wpost } from './utils/wfetch'

const FormItem = Form.Item
const Option = Select.Option


class CustomerAdd extends Component {

  state = {
    submitting: false
  }

  submitNewCustomer = async (e) => {
    e.preventDefault()
    this.setState({ submitting: true })

    const form = this.props.form
    let v = null

    try {
      const values = await form.validateFields()
      v = {...values}
      if (v.phoneNumber !== null) {
        v.phoneNumber = v.phoneNumber.replace(/[^0-9]/g,'')
      }
    } catch (err) {
      this.setState({ submitting: false })
    }

    if (v !== null) {
      try {
        const response = await wpost(`/customer`, v)
        if (!response.ok) {
            throw Error(response.statusText)
        }
        const responseBody = await response.json()
        this.props.history.push(`/customer/${responseBody.insertId}`)
      } catch (err) {
        message.error('There was an error creating the user.')
        this.setState({ submitting: false })
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <h1>Add New Customer</h1>
        <Form onSubmit={this.submitNewCustomer} className='login-form'>
          <FormItem>
            {getFieldDecorator('firstName', {
              rules: [{
                required: true,
                message: 'Please enter a first name.',
                whitespace: true
              }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('lastName', {
              rules: [{
                required: true,
                message: 'Please enter a last name.',
                whitespace: true
              }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('phoneNumber', {
              rules: [{
                required: false,
                type: 'string',
                pattern: /^[0-9-]+$/,
                message: 'Please enter a valid phone number.'
              }],
              initialValue: null
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Phone number" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                required: false,
                type: 'email',
                message: 'Please enter a valid email.'
              }],
              initialValue: null
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button" loading={this.state.submitting}>
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(CustomerAdd)

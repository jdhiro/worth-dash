import React, { Component } from 'react'
import { message, Form, Input, Tooltip, Icon, Button, Layout, Row, Col, Select, Checkbox, Cascader, AutoComplete } from 'antd'
import queryString from 'query-string'
import { wpost } from './utils/wfetch'

const FormItem = Form.Item
const Option = Select.Option


class CustomerAddForm extends Component {

  submitNewCustomer = async (e) => {
    e.preventDefault()
    this.props.form.validateFields( async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        // The state of the form to "in progress" so that it can't be closed during the request
        this.setState({ editCustomerInProgress: true })
        // Build the data object to send in the body
        const body = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          email: values.email,
        }
        try {
          // Execute the web service call to add the customer
          // TODO: Add logic to make sure another customer with the same name/phone doesn't exist. If so, require different phone #.
          const response = await wpost(`/customer`, body)
          if (!response.ok) {
              throw Error(response.statusText)
          }
          const responseBody = await response.json()
          this.props.history.push(`/customer/${responseBody.insertId}`)
        } catch(err) {
          console.log(err)
          console.log('err', err)
          message.error('There was an error updating the user.')
        }
      }
    })

  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <h1>Add New Customer</h1>
        <Form onSubmit={this.submitNewCustomer} className='login-form'>
          <FormItem>
            {getFieldDecorator('firstName', {
              rules: [{ required: true, message: 'Please enter a first name.' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="First name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('lastName', {
              rules: [{ required: true, message: 'Please enter a last name.' }],
            })(
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Last name" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('phoneNumber', {
              rules: [{ required: false, message: 'Please enter a phone number.' }],
            })(
              <Input prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Phone number" />
            )}
          </FormItem>

          <FormItem>
            {getFieldDecorator('email', {
              rules: [],
            })(
              <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
            )}
          </FormItem>

          <FormItem>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const CustomerAdd = Form.create()(CustomerAddForm)

export default CustomerAdd

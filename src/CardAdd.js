import React, { Component } from 'react'
import { Button, Form, Input, InputNumber, Layout  } from 'antd'
import { wpost } from './utils/wfetch'

const { Content } = Layout
const { TextArea } = Input

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class CardAddForm extends Component {
  state = {
    loading: false
  }

  componentDidMount() {
      this.props.form.validateFields()
    }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState({ loading:true })
        let cards = values.cardNumbers
        cards = cards.replace(/[^A-Za-z0-9,]/g,'') // Remove all funny characters
        cards = cards.split(',') // Split into array at the commas
        cards = cards.filter(a => a !== '') // Filter out any empty values
        let amount = parseInt(values.amount) * 100
        let response = await wpost('/card', { cards, amount } )
        let json = await response.json()
      }
    })
  }

  render() {

    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;

    const userNameError = isFieldTouched('cardNumbers') && getFieldError('cardNumbers')
    const passwordError = isFieldTouched('amount') && getFieldError('amount')
    return (
      <div>
        <h1>Add Gift Cards</h1>
        <Form onSubmit={this.handleSubmit} layout="vertical">
          <Form.Item validateStatus={userNameError ? 'error' : ''} help={userNameError || ''} label='Gift card numbers (comma seperated)'>
            {getFieldDecorator('cardNumbers', {
              rules: [{
                required: true,
                type:'string',
                pattern: /^[A-Za-z0-9, ]+$/,
                message: 'Only letters, numbers, and commas are allowed.'
              }],
            })(
              <TextArea rows={4} />
            )}
          </Form.Item>
          <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''} label='Whole dollar amount to preload'>
            {getFieldDecorator('amount', {
              rules: [{
                required: true,
                type: 'number',
                message: 'Enter a whole dollar amount.'
              }],
            })(
              <InputNumber min={1} precision={0} />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading}>Submit</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const CardAdd = Form.create()(CardAddForm)

export default CardAdd

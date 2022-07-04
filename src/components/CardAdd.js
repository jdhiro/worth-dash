import React, { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Typography  } from 'antd'
import http from '../utils/http'

const { Title } = Typography
const { TextArea } = Input

function CardAdd(props) {

  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  function success(numSuccess, numError) {
    Modal.success({
      title: 'Added gift cards successfully.',
      content: `${numSuccess} cards added, ${numError} errors`,
      onOk() {
        form.resetFields()
        setLoading(false)
      }
    })
  }
  
  function error() {
    Modal.error({
      title: 'Error adding gift cards.',
      content: 'Please check the format of the cards and try again. You can enter a single card number, or a comma-seperated list of numbers',
      onOk() {
        setLoading(false)
      }
    })
  }
  
  const handleFinish = async values => {
    console.log(values)
    setLoading(true)
    let cards = values.cards
    cards = cards.replace(/[^A-Za-z0-9,]/g,'') // Remove all funny characters
    cards = cards.split(',') // Split into array at the commas
    cards = cards.filter(a => a !== '') // Filter out any empty values
    let amount = parseInt(values.amount) * 100

    try {
      let response = await http.post('/card', {cards, amount})
      success(response.data.insertSuccess.length, response.data.insertError.length)
    } catch (e) {
      error()
    }
  }

  return (
    <div>
      <Title>Add cards</Title>
      <Form onFinish={handleFinish} layout="vertical" form={form} name="form">
        <Form.Item
          name="cards"
          label="Card number or multiple comma-seperated card numbers"
          rules={[{ required: true, type:'string', pattern: /^[A-Za-z0-9, ]+$/, message: 'Only letters, numbers, and commas are allowed.' }]}>
            <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="amount"
          label='Whole dollar amount to preload'
          rules={[{ required: true, type: 'number', message: 'Enter a whole dollar amount.' }]}>
            <InputNumber min={1} precision={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
        </Form.Item>
      </Form>
    </div>
  )

}

export default CardAdd

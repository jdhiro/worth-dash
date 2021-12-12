import React, { useState, useEffect } from 'react'
import { wfetch, wget, wpost, wput } from './utils/wfetch'
import moment from 'moment'
import { message, Row, Col, Button, Card, Form, Input, InputNumber, Modal, Table, Tabs } from 'antd'
import { useParams } from "react-router-dom"
import { Icon } from '@ant-design/compatible'
import ax from './utils/axios'
const TabPane = Tabs.TabPane
const FormItem = Form.Item

function CustomerDetail(props) {

  const [form] = Form.useForm()

  let { id } = useParams()

  useEffect(() => {
    getHistory()
    getCustomer()
  }, [])

  let [transactionHistory, setTransactionHistory] = useState([])
  let [rewardHistory, setRewardHistory] = useState([])
  let [customer, setCustomer] = useState({})

  let [working, setWorking] = useState(false)

  let [customerEditVisible, setCustomerEditVisible] = useState(false)
  let [balanceAdjustmentVisible, setBalanceAdjustmentVisible] = useState(false)
  let [rewardAdjustmentVisible, setRewardAdjustmentVisible] = useState(false)

  let balanceColumns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (v) => formatCurrency(v)
    },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedBy', dataIndex: 'createdby' },
    {
      title: 'Time',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  let rewardColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedBy', dataIndex: 'createdby' },
    {
      title: 'Time',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  const getHistory = async () => {
    const response = await wget(`/customer/${id}/history`)
    const json = await response.json()

    setTransactionHistory(json.creditTransactions)
    setRewardHistory(json.rewardTransactions)
  }

  const getCustomer = async () => {
    let response = await wget(`/customer/${id}`)
    let json = await response.json()

    setCustomer(json)
  }

  const closeModals = () => {
    if (!working) {
      setCustomerEditVisible(false)
      setBalanceAdjustmentVisible(false)
      setRewardAdjustmentVisible(false)
    }
  }

  const handleEditCustomer = async values => {
    setWorking(true)
    const body = { ...values, cardnumber: customer.cardnumber }
    try {
      const response = await ax.put(`/customer/${id}`, body)
      setCustomer(response.data)
      closeModals()
      message.success('User updated.')
    } catch (err) {
      message.error('There was an error.')
    } finally {
      setWorking(false)
    }
  }

  const handleBalanceAdjustment = async values => {
    setWorking(true)
    let v = {...values}
    if (v.credit > 0) v.credit = Math.round(parseFloat(v.credit) * 100)
    if (v.debit > 0) v.debit = Math.round(parseFloat(v.debit) * 100)
    const body = {...v, customerid: id}

    try {
      let response = await ax.post('/transaction', body)
      setCustomer(response.data)
      closeModals()
      message.success('Balance adjustment successful.')
      getHistory()
    } catch (err) {
      message.error('There was an error.')
    } finally {
      setWorking(false)
    }
  }

  const handleRewardAdjustment = async values => {
    setWorking(true)
    let v = {...values}
    v.amount = -v.amount // The API reverses this value, so we need to un-reverse it here.
    const body = {...v, customerid: id}
    try {
      // Execute the web service call to update the customer
      const response = await ax.post('/transaction/reward', body)
      setCustomer(response.data)
      closeModals()
      message.success('Reward adjustment successful.')
      getHistory()
    } catch (err) {
      message.error('There was an error.')
    } finally {
      setWorking(false)
    }
  }

  const formatCurrency = (cents) => (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 8 }}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={24}>
                <span style={{ fontSize: 'x-large' }}>{customer.firstname} {customer.lastname}</span><br />
                Phone: {customer.phonenumber}<br />
                Email: {customer.email}<br />
                Balance: {formatCurrency(customer.cashbalance)}<br />
                Rewards: {customer.rewardbalance}<br />
                Gift Card: {customer.cardnumber}<br />
                Customer since: {moment(customer.created_at).format('lll')}<br />
                Last active: {moment(customer.updated_at).format('lll')}
                <hr style={{ border: 'none', height: '1px', backgroundColor: '#AAA' }} />
                <Button onClick={() => setCustomerEditVisible(true)}>Edit Customer</Button>
                <Button onClick={() => setBalanceAdjustmentVisible(true)}>Balance Adjustment</Button>
                <Button onClick={() => setRewardAdjustmentVisible(true)}>Rewards Adjustment</Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 8 }}>
        <Col span={24}>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Balance' key='1'>
              <Table columns={balanceColumns} dataSource={transactionHistory} rowKey='id' />
            </TabPane>
            <TabPane tab='Rewards' key='2'>
              <Table columns={rewardColumns} dataSource={rewardHistory} rowKey='id' />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

    
      <Modal title={'Edit Customer'} visible={customerEditVisible} onCancel={closeModals} footer={null} destroyOnClose={true}>
        <Form layout="vertical" onFinish={handleEditCustomer}>

          <Form.Item label="First name" name="firstname" initialValue={customer.firstname} rules={[{ required: true, pattern: /^[A-z-']+$/, message: 'Please enter a first name.', whitespace: true }]}>
            <Input type='text' />
          </Form.Item>

          <Form.Item label="Last name" name="lastname" initialValue={customer.lastname} rules={[{ required: true, pattern: /^[A-z-']+$/, message: 'Please enter a last name.', whitespace: true }]}>
            <Input type='text' />
          </Form.Item>

          <Form.Item label="Phone number" name="phonenumber" initialValue={customer.phonenumber} rules={[{ required: true, type: 'string', pattern: /^[0-9-]+$/, message: 'Please enter a valid phone number.' }]}>
            <Input type='text' />
          </Form.Item>

          <Form.Item label="Email address" name="email" initialValue={customer.email} rules={[{ required: false, type: 'email', message: 'Please enter a valid email.' }]}>
            <Input type='email' />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={working}>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={'Balance Adjustment'} visible={balanceAdjustmentVisible} onCancel={closeModals} footer={null} destroyOnClose={true}>
        <Form layout="vertical" onFinish={handleBalanceAdjustment}>

          <FormItem label='Credit' name="credit" initialValue={0}>
            <InputNumber step={1} precision={2} size={10} min={0} />
          </FormItem>

          <FormItem label='Debit' name="debit" initialValue={0}>
            <InputNumber step={1} precision={2} size={10} min={0} />
          </FormItem>

          <FormItem label='Description' name="description" rules={[{ required: true, type: 'string', message: 'Description required.' }]}>
            <Input />
          </FormItem>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={working}>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title={'Rewards Adjustment'} visible={rewardAdjustmentVisible} onCancel={closeModals} footer={null} destroyOnClose={true}>
        <Form layout="vertical" onFinish={handleRewardAdjustment}>

          <Form.Item label='Amount' name="amount" rules={[{ required: true, type: 'number', message: 'Required' }]}>
            <InputNumber step={1} precision={0} size={10} />
          </Form.Item>

          <Form.Item label='Description' name="description" rules={[{ required: true, type: 'string', message: 'Description required.' }]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={working}>Submit</Button>
          </Form.Item>
        </Form>
      </Modal>


    </div>
  )
}

export default CustomerDetail

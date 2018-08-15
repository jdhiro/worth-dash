import React, { Component } from 'react'
import { get, post, put } from './utils/wfetch'
import moment from 'moment'
import { message, Icon, Avatar, Row, Col, Button, Card, Form, Input, InputNumber, Modal, Table, Tabs } from 'antd'
const TabPane = Tabs.TabPane
const FormItem = Form.Item

class CustomerDetail extends Component {
  constructor(props) {
    super(props)
    this.id = props.match.params.id
    this.getHistory()
    this.getCustomer()
  }

  state = {
    transactionHistory: [],
    rewardHistory: [],
    customer: {},
    editCustomerVisible: false,
    editCustomerInProgress: false,
    ce_lastName: '',
    ce_firstName: '',
    ce_phoneNumber: '',
    ce_email: '',
    ba_amount: '',
    ba_description: '',
    ra_amount: '',
    ra_description: '',
  }

  balanceColumns = [
    { title: 'ID', dataIndex: 'id' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (v) => this.formatCurrency(v)
    },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedBy', dataIndex: 'createdBy'},
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  rewardColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedBy', dataIndex: 'createdBy'},
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  getHistory = async () => {
    const response = await get(`/customer/${this.id}/history`)
    const json = await response.json()

    this.setState({
      transactionHistory: json.creditTransactions,
      rewardHistory:json.rewardTransactions
    })
  }

  getCustomer = async () => {
    let response = await get (`/customer/${this.id}`)
    let json = await response.json()

    this.setState({ customer: json })
  }

  showEditCustomer = () => {
    this.setState({
      ce_firstName: this.state.customer.firstName,
      ce_lastName: this.state.customer.lastName,
      ce_phoneNumber: this.state.customer.phoneNumber,
      ce_email: this.state.customer.email,
    })
    this.setState({ editCustomerVisible: true })
  }

  closeEditCustomer = () => {
    if(!this.state.editCustomerInProgress) {
      this.setState({ editCustomerVisible: false })
    }
  }

  submitEditCustomer = async (e) => {
    e.preventDefault()
    // The state of the form to "in progress" so that it can't be closed during the request
    this.setState({ editCustomerInProgress: true })
    // Build the data object to send in the body
    const body = {
      firstName: this.state.ce_firstName,
      lastName: this.state.ce_lastName,
      phoneNumber: this.state.ce_phoneNumber,
      email: this.state.ce_email,
    }
    try {
      // Execute the web service call to update the customer
      const response = await put(`/customer/${this.state.customer.id}`, body)
      if (!response.ok) {
          throw Error(response.statusText)
      }
      await this.getCustomer()
      this.setState({ editCustomerInProgress: false })
      this.closeEditCustomer()
    } catch(err) {
      console.log(err)
      this.setState({ editCustomerInProgress: false })
      this.closeEditCustomer()
      message.error('There was an error updating the user.')
    }
  }

  submitBalanceAdjustment = async (e) => {
    e.preventDefault()
    const body = {
      customerId: this.state.customer.id,
      description: this.state.ba_description,
      accrueRewards: false
    }
    if (this.state.ba_amount > 0) {
      body.credit = this.state.ba_amount * 100
    } else if(this.state.ba_amount < 0) {
      body.debit = Math.abs(this.state.ba_amount) * 100
    }
    try {
      // Execute the web service call to update the customer
      const response = await post('/transaction', body)
      if (!response.ok) {
          throw Error(response.statusText)
      }
      await Promise.all([this.getHistory(), this.getCustomer()])
      this.setState({ ba_amount: '', ba_description: '' })
    } catch(err) {
      console.log(err)
      message.error('There was an error updating the user.')
    }
  }

  submitRewardAdjustment = async (e) => {
    console.log('submitRewardAdjustment')
    e.preventDefault()
    const body = {
      customerId: this.state.customer.id,
      amount: this.state.ra_amount,
      description: this.state.ra_description
    }
    try {
      // Execute the web service call to update the customer
      const response = await post('/transaction/reward', body)
      if (!response.ok) {
          throw Error(response.statusText)
      }
      await Promise.all([this.getHistory(), this.getCustomer()])
      this.setState({ ra_amount: '', ra_description: '' })
    } catch(err) {
      console.log(err)
      message.error('There was an error updating the user.')
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  formatCurrency = (cents) => (cents / 100).toLocaleString('en-US', {style:'currency', currency:'USD'})



  render() {
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 8 }}>
          <Col span={24}>
            <Card>
              <Row>
                <Col span={3}><Avatar size='large' icon='user' /></Col>
                <Col span={21}>
                  <span style={{ fontSize: 'x-large' }}>{this.state.customer.firstName} {this.state.customer.lastName}</span><br />
                  <Icon type='phone' /> {this.state.customer.phoneNumber}<br />
                  <Icon type='mail' /> {this.state.customer.email}<br />
                  Balance: {this.formatCurrency(this.state.customer.cashBalance)}<br />
                  Rewards: {this.state.customer.rewardBalance}<br />
                  Linked gift cards: {this.state.customer.cardNumber}<br />
                  <span style={{ fontSize: 'x-small', color: 'darkgrey' }}>Created {moment(this.state.customer.createdAt).format('lll')}</span><br />
                  <span style={{ fontSize: 'x-small', color: 'darkgrey' }}>Updated {moment(this.state.customer.updatedAt).format('lll')}</span><br />
                  <hr style={{ border: 'none', height: '1px', backgroundColor: '#AAA' }} />
                  <a onClick={this.showEditCustomer}>Edit</a>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row  gutter={16} style={{ marginBottom: 8 }}>
          <Col span={24}>
            <Tabs defaultActiveKey='1'>
              <TabPane tab='Balance adjustment' key='1'>
                <Card>
                  <Form layout='inline' onSubmit={this.submitBalanceAdjustment}>
                    <FormItem label='Amount'>
                      {/* InputNumber doesn't pass events like Input, so we can't set state by name */}
                      <InputNumber step={1} precision={2} size={10} value={this.state.ba_amount} onChange={(v) => this.setState({ ba_amount: v })} />
                    </FormItem>
                    <FormItem label='Description'>
                      <Input name='ba_description' value={this.state.ba_description} onChange={this.handleChange} />
                    </FormItem>
                    <FormItem>
                      <Button htmlType='submit' type='primary'>Submit</Button>
                    </FormItem>
                  </Form>
                </Card>
                <br />
                <Table columns={this.balanceColumns} dataSource={this.state.transactionHistory} rowKey='id' />
              </TabPane>
              <TabPane tab='Reward adjustment' key='2'>
                <Card>
                  <Form layout='inline' onSubmit={this.submitRewardAdjustment}>
                    <FormItem label='Amount'>
                      <InputNumber step={1} precision={0} size={10} value={this.state.ra_amount} onChange={(v) => this.setState({ ra_amount: v })} />
                    </FormItem>
                    <FormItem label='Description'>
                      <Input name='ra_description' value={this.state.ra_description} onChange={this.handleChange}/>
                    </FormItem>
                    <FormItem>
                      <Button htmlType='submit' type='primary'>Submit</Button>
                    </FormItem>
                  </Form>
                </Card>
                <br />
                <Table columns={this.rewardColumns} dataSource={this.state.rewardHistory} rowKey='id' />
              </TabPane>
            </Tabs>
          </Col>
        </Row>

        <Modal title={'Edit Customer'} visible={this.state.editCustomerVisible} onOk={this.submitEditCustomer} onCancel={this.closeEditCustomer} confirmLoading={this.state.editCustomerInProgress}>
          <Form onSubmit={this.submitEditCustomer}>
            <FormItem label='First name'>
              <Input type='text' name='ce_firstName' value={this.state.ce_firstName} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Last name'>
              <Input type='text' name='ce_lastName' value={this.state.ce_lastName} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Phone number'>
              <Input type='text' name='ce_phoneNumber' value={this.state.ce_phoneNumber} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Email address'>
              <Input atype='email' name='ce_email' value={this.state.ce_email} onChange={this.handleChange} />
            </FormItem>
            <FormItem style={{ display: 'none' }}>
              <Button htmlType='submit'>Submit</Button>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default CustomerDetail

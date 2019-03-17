import React, { Component } from 'react'
import { wfetch, wget, wpost, wput } from './utils/wfetch'
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
    validateStatus: 'validating',
    // customer editing variables
    ce_lastname: '',
    ce_firstname: '',
    ce_phonenumber: '',
    ce_email: '',
    ce_cardnumber: '',
    // balance adjustment variables
    ba_credit: '',
    ba_debit: '',
    ba_description: '',
    // reward adjustment variables
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
    { title: 'CreatedBy', dataIndex: 'createdby'},
    {
      title: 'Time',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  rewardColumns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedBy', dataIndex: 'createdby'},
    {
      title: 'Time',
      dataIndex: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend',
      render: (v) => moment(v).format('lll')
    }
  ]

  getHistory = async () => {
    const response = await wget(`/customer/${this.id}/history`)
    const json = await response.json()

    this.setState({
      transactionHistory: json.creditTransactions,
      rewardHistory:json.rewardTransactions
    })
  }

  getCustomer = async () => {
    let response = await wget(`/customer/${this.id}`)
    let json = await response.json()

    this.setState({ customer: json })
  }

  showEditCustomer = () => {
    console.log(this.state.customer)
    this.setState({
      ce_firstname: this.state.customer.firstname,
      ce_lastname: this.state.customer.lastname,
      ce_phonenumber: this.state.customer.phonenumber,
      ce_email: this.state.customer.email,
      ce_cardnumber: this.state.customer.cardnumber,
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
      firstname: this.state.ce_firstname,
      lastname: this.state.ce_lastname,
      phonenumber: this.state.ce_phonenumber,
      email: this.state.ce_email,
      cardnumber: this.state.ce_cardnumber,
    }
    try {
      // Execute the web service call to update the customer
      const response = await wput(`/customer/${this.state.customer.id}`, body)
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

    if (this.state.ba_description === '') {
      this.setState({validateStatus: 'error'})
      message.info('Description required')
      return
    } else {
      this.setState({validateStatus: 'validating'})
    }

    const body = {
      customerid: this.state.customer.id,
      credit: 0,
      debit: 0,
      description: this.state.ba_description,
    }
    if (this.state.ba_credit > 0) {
      body.credit = Math.round(parseFloat(this.state.ba_credit) * 100)
    }
    if (this.state.ba_debit > 0) {
      body.debit = Math.round(parseFloat(this.state.ba_debit) * 100)
    }
    try {
      // Execute the web service call to update the customer
      const response = await wpost('/transaction', body)
      if (!response.ok) {
          throw Error(response.statusText)
      }
      await Promise.all([this.getHistory(), this.getCustomer()])
      this.setState({ ba_credit: '', ba_debit: '', ba_description: '' })
    } catch(err) {
      console.log(err)
      message.error('There was an error updating the user.')
    }
  }

  submitRewardAdjustment = async (e) => {
    e.preventDefault()
    const body = {
      customerid: this.state.customer.id,
      amount: -this.state.ra_amount,
      description: this.state.ra_description
    }
    try {
      // Execute the web service call to update the customer
      const response = await wfetch({path: '/transaction/reward', method: 'POST', body})
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
                  <span style={{ fontSize: 'x-large' }}>{this.state.customer.firstname} {this.state.customer.lastname}</span><br />
                  <Icon type='phone' /> {this.state.customer.phonenumber}<br />
                  <Icon type='mail' /> {this.state.customer.email}<br />
                  Balance: {this.formatCurrency(this.state.customer.cashbalance)}<br />
                  Rewards: {this.state.customer.rewardbalance}<br />
                  Gift Card: {this.state.customer.cardnumber}<br />
                  <span style={{ fontSize: 'x-small', color: 'darkgrey' }}>Created {moment(this.state.customer.created_at).format('lll')}</span><br />
                  <span style={{ fontSize: 'x-small', color: 'darkgrey' }}>Updated {moment(this.state.customer.updated_at).format('lll')}</span><br />
                  <hr style={{ border: 'none', height: '1px', backgroundColor: '#AAA' }} />
                  <Button onClick={this.showEditCustomer}>Edit</Button>
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

                    <FormItem label='Credit'>
                      {/* InputNumber doesn't pass events like Input, so we can't set state by name */}
                      <InputNumber step={1} precision={2} size={10} min={0} value={this.state.ba_credit} onChange={(v) => this.setState({ ba_credit: v })} />
                    </FormItem>

                    <FormItem label='Debit'>
                      {/* InputNumber doesn't pass events like Input, so we can't set state by name */}
                      <InputNumber step={1} precision={2} size={10} min={0} value={this.state.ba_debit} onChange={(v) => this.setState({ ba_debit: v })} />
                    </FormItem>

                    <FormItem label='Description' required={true} validateStatus={this.state.validateStatus}>
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
                      <Input disabled placeholder='Temporarily disabled' name='ra_description' value={this.state.ra_description} onChange={this.handleChange}/>
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
              <Input type='text' name='ce_firstname' value={this.state.ce_firstname} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Last name'>
              <Input type='text' name='ce_lastname' value={this.state.ce_lastname} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Phone number'>
              <Input type='text' name='ce_phonenumber' value={this.state.ce_phonenumber} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Email address'>
              <Input type='email' name='ce_email' value={this.state.ce_email} onChange={this.handleChange} />
            </FormItem>
            <FormItem label='Card number'>
              <Input type='text' name='ce_cardnumber' value={this.state.ce_cardnumber} onChange={this.handleChange} />
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

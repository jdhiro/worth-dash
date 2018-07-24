import React, { Component } from 'react'
import { Alert, Row, Col, Button, Card, Form, Input, InputNumber, Modal, Table, Tabs } from 'antd'

const TabPane = Tabs.TabPane
const FormItem = Form.Item

const AdjustmentForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onOk, form, title } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal visible={visible} title={title} onCancel={onCancel} onOk={onOk} destroyOnClose={true}>
          <Form>
            <FormItem label='Amount'>
              {getFieldDecorator('amount', {
                rules: [{ required: true, message: 'Please enter an amount.' }],
              })(
                <InputNumber step={1} precision={2} size={10} />
              )}
            </FormItem>
            <FormItem label='Description'>
              {getFieldDecorator('description', {
                rules: [{ required: true, message: 'Please enter a description.' }]
              })(
                <Input type='text' />
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

const CustomerEditForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onOk, form, title, afterClose } = this.props
      const { getFieldDecorator } = form

      return (
        <Modal visible={visible} title={title} onCancel={onCancel} onOk={onOk} destroyOnClose={true}>
          <Form>
            <FormItem label='First name'>
              {getFieldDecorator('firstName', {
                initialValue: 'foo',
                rules: [{ required: true, message: 'Please enter a name.' }]
              })(
                <Input autoComplete='edit-customer-firstName' type='text' />
              )}
            </FormItem>
            <FormItem label='Last name'>
              {getFieldDecorator('lastName', {
                rules: [{ required: true, message: 'Please enter a name.' }]
              })(
                <Input autoComplete='edit-customer-lastName' type='text' />
              )}
            </FormItem>
            <FormItem label='Phone number'>
              {getFieldDecorator('phoneNumber', {
                rules: [{ required: true, message: 'Please enter a phone number.' }]
              })(
                <Input autoComplete='edit-customer-phoneNumber' type='text' />
              )}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)

class CustomerDetail extends Component {
  constructor(props) {
    super(props)
    this.id = props.match.params.id
    this.getHistory()
    this.getCustomer()
  }

  state = {
    history: [],
    customer: {},
    creditAdjustmentVisible: false,
    rewardAdjustmentVisible: false,
    editCustomerVisible: false,
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount' },
    { title: 'Description', dataIndex: 'description' },
    { title: 'CreatedAt', dataIndex: 'createdAt', sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt), defaultSortOrder: 'descend' }
  ]

  getHistory = async () => {
    let response = await fetch(`http://0.0.0.0:8081/customer/${this.id}/history`, {
      headers: { 'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1Y2wiLCJpYXQiOjE1MzEwNzA4NTl9.Cy-_L7tMuQOtBAvXFG3KruS3zs8evl466c3Dv9i6NBw' }
    })
    let json = await response.json()
    let history = [...json.creditTransactions, ...json.rewardTransactions]

    this.setState({ history })
  }

  getCustomer = async () => {
    let response = await fetch(`http://0.0.0.0:8081/customer/${this.id}`, {
      headers: { 'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1Y2wiLCJpYXQiOjE1MzEwNzA4NTl9.Cy-_L7tMuQOtBAvXFG3KruS3zs8evl466c3Dv9i6NBw' }
    })
    let customer = await response.json()

    this.setState({ customer })
  }

  showCreditAdjustment = () => {
    console.log('fii')
    this.setState({ creditAdjustmentVisible: true })
  }

  showRewardAdjustment = () => {
    this.setState({ rewardAdjustmentVisible: true })
  }

  showCustomerEdit = () => {
    this.setState({ editCustomerVisible: true })
  }

  closeAllForms = () => {
    this.setState({
      creditAdjustmentVisible: false,
      rewardAdjustmentVisible: false,
      editCustomerVisible: false,
    })
  }

  handleCancel = () => this.closeAllForms()

  handleCustomerEditOk = () => {
    const form = this.customerFormRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        return
      }

      console.log('Received values of form: ', values)
      form.resetFields()
      this.closeAllForms()
    })
  }

  saveCreditFormRef = (form) => this.creditFormRef = form
  saveRewardFormRef = (form) => this.rewardFormRef = form
  saveCustomerFormRef = (form) => this.customerFormRef = form

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 8 }}>
          <Col span={12}>
            <Card title={`${this.state.customer.firstName} ${this.state.customer.lastName}`} extra={<a onClick={this.showCustomerEdit}>Edit</a>}>
              First name: {this.state.customer.firstName}<br />
              Last name: {this.state.customer.lastName}<br />
              Phone number: {this.state.customer.phoneNumber}<br />
              Email address: {this.state.customer.email}<br />
              Cash balance: {this.state.customer.cashBalance}<br />
              Reward balance: {this.state.customer.rewardBalance}<br />
              Created at: {this.state.customer.createdAt}<br />
              Updated at: {this.state.customer.updatedAt}<br />
              Linked gift cards: {this.state.customer.cardNumber}
            </Card>
          </Col>
        </Row>
        <Row  gutter={16} style={{ marginBottom: 8 }}>
          <Col span={3}>
            <Button onClick={this.showCreditAdjustment}>Credit Adjustment</Button>
          </Col>
          <Col span={3}>
            <Button onClick={this.showRewardAdjustment}>Reward Adjustment</Button>
          </Col>
        </Row>
        <Row  gutter={16} style={{ marginBottom: 8 }}>
          <Col span={24}>
            <Table columns={this.columns} dataSource={this.state.history} rowKey='id' />
          </Col>
        </Row>

        <AdjustmentForm
          title='Credit Adjustment'
          wrappedComponentRef={this.saveCreditFormRef}
          visible={this.state.creditAdjustmentVisible}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
        />
        <AdjustmentForm
          title='Reward Adjustment'
          wrappedComponentRef={this.saveRewardFormRef}
          visible={this.state.rewardAdjustmentVisible}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
        />
        <CustomerEditForm
          title='Edit Customer'
          wrappedComponentRef={this.saveCustomerFormRef}
          visible={this.state.editCustomerVisible}
          onCancel={this.handleCancel}
          onOk={this.handleCustomerEditOk}
        />
      </div>
    )
  }
}

export default CustomerDetail

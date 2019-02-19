import React from 'react'
import { wfetch, NetworkError, ResponseError } from './utils/wfetch'
import { Button, Form, Input, Table, Modal, message } from 'antd'

export default class SettingsStoresPage extends React.Component {

  state = {
    accounts: [
      { id: 1, username: 'ucljuanita', type: 'user' },
      { id: 2, username: 'ucladmin', type: 'owner' },
      { id: 3, username: 'uclslater', type: 'user' },
    ],
    modalVisible: false,
    modalSelectedRecord: null,
    newPassword: '',
  }

  showModal = (record) => {
    this.setState({ modalVisible: true, modalSelectedRecord: record})
  }

  handleOk = async (e) => {
    e.preventDefault()

    const { username } = this.state.modalSelectedRecord
    const body = {
      username,
      password: this.state.newPassword
    }

    try {
      let response = await wfetch({ path: `/change-password`, method: 'POST', body })
      if (!response.ok) {
        throw new ResponseError('', response)
      } else {
      }
    } catch(err) {
      if (err instanceof ResponseError) {
        if (err.res.status === 401) {
          message.info('Unauthorized username and password.', 5)
        } else if (err.res.status === 500) {
          message.info('Server error.', 5)
        }
      } else if (err instanceof NetworkError) {
        message.info('Network error, please check your connection.', 5)
      }
    }

    this.setState({ modalVisible: false, modalSelectedRecord: null})
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.setState({ modalVisible: false, modalSelectedRecord: null})
  }

  handleChange = (e) => {
    this.setState({newPassword: e.target.value})
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Type', dataIndex: 'type' },
    { title: 'Action', key: 'action', render: (text, record) => (
      <span>
        <Button onClick={() => this.showModal(record)}>Change password</Button>
      </span>
    )}
  ]

  render() {

    return(
      <div>
        <Table columns={this.columns} dataSource={this.state.accounts} rowKey='id' style={{ marginTop: '15px' }} />
        <Modal title='Change Password' visible={this.state.modalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Form onSubmit={()=>''}>
            <Form.Item label='New password'>
              <Input type='password' name='newPassword' value={this.state.newPassword} onChange={this.handleChange} />
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              <Button htmlType='submit'>Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }

}

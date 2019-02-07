import React from 'react'
import { wfetch, NetworkError, ResponseError } from './utils/wfetch'
import { Button, Form, Input, Table, Modal } from 'antd'

export default class SettingsStoresPage extends React.Component {

  state = {
    accounts: [
      { id: 1, username: 'ucljuanita', type: 'user' },
      { id: 2, username: 'ucladmin', type: 'owner' },
      { id: 3, username: 'uclslater', type: 'user' },
    ],
    modalVisible: false,
    modalSelectedRecord: null,
  }

  showModal = (record) => {
    this.setState({ modalVisible: true, modalSelectedRecord: record})
  }

  handleOk = (e) => {
    e.preventDefault()
    this.setState({ modalVisible: false, modalSelectedRecord: null})
  }

  handleCancel = (e) => {
    e.preventDefault()
    this.setState({ modalVisible: false, modalSelectedRecord: null})
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
      (This page doesn't work yet)
        <Table columns={this.columns} dataSource={this.state.accounts} rowKey='id' style={{ marginTop: '15px' }} />
        <Modal
          title='Change Password'
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
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

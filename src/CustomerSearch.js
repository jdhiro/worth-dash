import * as Sentry from '@sentry/browser'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { wfetch, NetworkError, ResponseError } from './utils/wfetch'
import { Alert, message, Table, Input } from 'antd'
const { Search } = Input

class CustomerSearch extends Component {
  state = {
    query: '',
    results: []
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'First name', dataIndex: 'firstname' },
    { title: 'Last name', dataIndex: 'lastname' },
    { title: 'Phone', dataIndex: 'phonenumber' },
    { title: 'Action', key: 'action', render: (text, record) => (
      <span>
        <Link to={'customer/' + record.id}>View details</Link>
      </span>
    )}
  ]

  handleSubmit = async (val, e) => {
    try {
      let response = await wfetch({ path: `/search?q=${encodeURIComponent(val)}` })
      if (!response.ok) {
        throw new ResponseError('', response)
      } else {
        let json = await response.json()
        this.setState({ results: json })
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
      Sentry.captureException(err)
    }
  }

  render() {
    return (
      <div>
        <h1>Search for customer account</h1>
        <Search size='large' placeholder='Search for last name, first name, or phone number' enterButton onSearch={this.handleSubmit} />
        <Alert
          message='Search for a gift card by prefixing the number with "#". Search for an account ID by prefixing with "@".'
          type="info"
          showIcon
           style={{ marginTop: '15px' }}
        />
        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }
}


export default CustomerSearch

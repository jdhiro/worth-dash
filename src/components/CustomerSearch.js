import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { wfetch, NetworkError, ResponseError } from '../utils/wfetch'
import { Alert, message, Table, Input, Typography } from 'antd'
const { Search } = Input

const { Title } = Typography


function CustomerSearch(props) {

  const [results, setResults] = useState([])

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'First name', dataIndex: 'firstname' },
    { title: 'Last name', dataIndex: 'lastname' },
    { title: 'Phone', dataIndex: 'phonenumber' },
    { title: 'Action', key: 'action', render: (text, record) => (
      <span>
        <Link to={'/customer/' + record.id}>View details</Link>
      </span>
    )}
  ]

  const handleSubmit = async (val, e) => {
    try {
      let response = await wfetch({ path: `/search?q=${encodeURIComponent(val)}&limit=1000` })
      if (!response.ok) {
        throw new ResponseError('', response)
      } else {
        let json = await response.json()
        setResults(json)
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
  }

  return (
    <div>
      <Title>Search</Title>
      <Search size='large' placeholder='Search for last name, first name, or phone number' enterButton onSearch={handleSubmit} />
      <Alert
        message='Search for a gift card by prefixing the number with "#".'
        type="info"
        showIcon
          style={{ marginTop: '15px' }}
      />
      <Table columns={columns} dataSource={results} rowKey='id' style={{ marginTop: '15px' }} />
    </div>
  )

}


export default CustomerSearch

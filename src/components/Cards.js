import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import http from '../utils/http'
import { Alert, message, Table, Input, Typography } from 'antd'
const { Search } = Input

const { Title } = Typography


function Cards() {

  const [results, setResults] = useState([])

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Card Number', dataIndex: 'cardnumber' },
    { title: 'Action', key: 'action', render: (text, record) => (
      <span>
        <Link to={'/customer/' + record.id}>View details</Link>
      </span>
    )}
  ]

  const handleSubmit = async (val, e) => {
    try {
      if (val === '') return
      let res = await http.get(`/search?q=${encodeURIComponent('#'+val)}&limit=1000`)
      setResults(res.data)
    } catch (e) {
      message.info('Error querying customers, please try again.', 5)
      console.log(e)
    }
  }

  return (
    <div>
      <Title>Cards</Title>
      <Search size='large' placeholder='Search for gift card number' allowClear="true" enterButton onSearch={handleSubmit} />
      <Table columns={columns} dataSource={results} rowKey='id' style={{ marginTop: '15px' }} />
    </div>
  )

}


export default Cards

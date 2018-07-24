import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { Table, Input } from 'antd'

const Search = Input.Search

class CustomerSearch extends Component {
  state = {
    query: '',
    results: []
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'First name', dataIndex: 'firstName' },
    { title: 'Last name', dataIndex: 'lastName' },
    { title: 'Phone', dataIndex: 'phoneNumber' },
    { title: 'Action', key: 'action', render: (text, record) => (
      <span>
        <Link to={'customer/' + record.id}>View details</Link>
      </span>
    )}
  ]

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.getCustomers()
  }

  getCustomers = async () => {
    let response = await fetch(`http://0.0.0.0:8081/customer/ac?q=${this.state.query}`, {
      headers: { 'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1Y2wiLCJpYXQiOjE1MzEwNzA4NTl9.Cy-_L7tMuQOtBAvXFG3KruS3zs8evl466c3Dv9i6NBw' }
    })
    let json = await response.json()

    this.setState({ results: json })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input placeholder='Search for...' name='query' value={this.state.query} onChange={this.handleChange} />
          <input type='submit' />
        </form>
        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' />
      </div>
    )
  }
}


export default CustomerSearch

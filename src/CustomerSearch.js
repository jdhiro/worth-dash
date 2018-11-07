import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Table, Input, Select } from 'antd'
import { wfetch } from './utils/wfetch'

const { Content } = Layout
const { Search } = Input
const InputGroup = Input.Group
const Option = Select.Option

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

  /*
  handleSubmit = (e) => {
    e.preventDefault()
    this.getCustomers()
  }

  getCustomers = async () => {
    let response = await wfetch({ path: `/customer/ac?q=${this.state.query}` })
    let json = await response.json()
    this.setState({ results: json })
  }
  */

  handleSearch = async (val, e) => {
    let response = await wfetch({ path: `/customer/ac?q=${val}` })
    let json = await response.json()
    this.setState({ results: json })
  }

  render() {
    return (
      <div>
        <h1>Search for Customer</h1>
      {/*TODO: Add support for selection refinement.
        <InputGroup size='large' compact>
        <Select size='large' defaultValue='lastName'  style={{ width: '25%' }}>
          <Option value='lastName'>Last name</Option>
          <Option value='firstName'>First name</Option>
          <Option value='phoneNumber'>Phone number</Option>
          <Option value='id'>ID</Option>
        </Select>
        <Search size='large' placeholder='Search' style={{ width: '75%' }} enterButton onSearch={this.handleSearch} />
      </InputGroup>*/}
      <Search size='large' placeholder='Search for last name, first name, or phone number' enterButton onSearch={this.handleSearch} />
      <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }
}


export default CustomerSearch

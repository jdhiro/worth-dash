import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { DatePicker, Button, Layout, Table } from 'antd'
import { wfetch } from './utils/wfetch'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker


const { Content } = Layout

class Reports extends Component {

  state = {
    query: '',
    results: []
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount', render: (text, record) => (
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(text/100)
    ) },
    { title: 'Time (UTC)', dataIndex: 'createdAt', render: (text, record) => (
      new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric',}).format(new Date(text))
    ) },
    { title: 'Location', dataIndex: 'createdBy' },
    { title: 'Customer', dataIndex: 'customerId', render: (text, record) => (
      <Link to={'customer/' + record.customerId}>{text}</Link>
    ) },
    { title: 'Description', dataIndex: 'description' }
  ]

  onDateRangeChanged = async (date, dateString) => {
    let response = await wfetch({ path: `/transaction?drs=${dateString[0]}&dre=${dateString[1]}` })
    let json = await response.json()
    if (response.status === 200) {
      this.setState({ results: json })
    }
  }

  render() {
    return (
      <div>
        <div>
          <RangePicker onChange={this.onDateRangeChanged} />
        </div>
        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }
}


export default Reports

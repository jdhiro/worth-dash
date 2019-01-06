import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, DatePicker, Table } from 'antd'
import { wfetch, ResponseError } from './utils/wfetch'
import { saveAs } from 'file-saver'

const { RangePicker } = DatePicker

class Reports extends Component {

  state = {
    query: '',
    results: [],
    currentDateStrings: null
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount', render: (text, record) => (
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(text/100)
    ) },
    {
      title: 'Time (UTC)',
      dataIndex: 'createdAt',
      sortDirections: ['ascend' | 'descend'],
      sorter: (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
    },
    { // TODO: Remove these hard coded values later...
      filters: [
        {text: 'Juanita', value: '1',},
        {text: 'Admin', value: '2',},
        {text: 'Slater', value: '3',}
      ],
      title: 'Location',
      dataIndex: 'createdBy',
      onFilter: (value, record) => record.createdBy.indexOf(value) === 0,
    },
    { title: 'Customer', dataIndex: 'customerId', render: (text, record) => (
      <Link to={'customer/' + record.customerId}>{text}</Link>
    ) },
    { title: 'Description', dataIndex: 'description' }
  ]

  onDateRangeChanged = async (dates, dateStrings) => {
    try {
      let response = await wfetch({ path: `/transaction?drs=${dateStrings[0]}&dre=${dateStrings[1]}` })
      if (!response.ok) {
        throw new ResponseError('', response)
      } else {
        this.state.currentDateStrings = dateStrings
        let json = await response.json()
        this.setState({ results: json })
      }
    } catch (err) {
      // TODO: Better error handling.
      console.log(err)
    }
  }

  downloadCsvReport = async () => {

    try {
      const dateStrings = this.state.currentDateStrings
      let response = await wfetch({ path: `/transaction?drs=${dateStrings[0]}&dre=${dateStrings[1]}&type=csv` })
      if (!response.ok) {
        throw new ResponseError('', response)
      } else {
        let blob = await response.blob()
        saveAs(blob, 'report.csv')
      }
    } catch (err) {
      // TODO: Better error handling.
      console.log(err)
    }

  }

  render() {
    return (
      <div>
        <div>
          <RangePicker onChange={this.onDateRangeChanged} /> <Button onClick={this.downloadCsvReport} disabled={!this.state.currentDateStrings}>Download report</Button>
        </div>

        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }
}


export default Reports

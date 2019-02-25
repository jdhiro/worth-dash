import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, DatePicker, Table } from 'antd'
import { wfetch, ResponseError } from './utils/wfetch'
import { saveAs } from 'file-saver'
import moment from 'moment'

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
      dataIndex: 'createdat',
      sortDirections: ['ascend' | 'descend'],
      sorter: (a, b) => Date.parse(a.createdat) - Date.parse(b.createdat)
    },
    { // TODO: Remove these hard coded values later...
      filters: [
        {text: 'Juanita', value: '1',},
        {text: 'Admin', value: '2',},
        {text: 'Slater', value: '3',}
      ],
      title: 'Location',
      dataIndex: 'createdby',
      onFilter: (value, record) => record.createdby.indexOf(value) === 0,
    },
    { title: 'Customer', dataIndex: 'customerid', render: (text, record) => (
      <Link to={'customer/' + record.customerid}>{text}</Link>
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
        if (this.state.results.length === 0) this.setState({currentDateStrings: null})
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
    const ranges = {
      today: [moment(), moment()],
      yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      week: [moment().subtract(1, 'week'), moment()]
    }
    return (
      <div>
      <h1>Reports</h1>
        <div>
          <RangePicker allowClear='true' ranges={ranges} onChange={this.onDateRangeChanged} />
        </div>

        <Table
          columns={this.columns}
          dataSource={this.state.results}
          rowKey='id'
          style={{ marginTop: '15px' }}
          footer={() => <Button size='small' onClick={this.downloadCsvReport} disabled={!this.state.currentDateStrings}>Download report</Button>}
        />

      </div>
    )
  }
}


export default Reports

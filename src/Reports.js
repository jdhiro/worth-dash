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
    currentDateStrings: []
  }

  columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: 'Amount', dataIndex: 'amount', render: (text, record) => (
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(text/100)
    ) },
    { title: 'Time (UTC)', dataIndex: 'createdAt'},
    { title: 'Location', dataIndex: 'createdBy' },
    { title: 'Customer', dataIndex: 'customerId', render: (text, record) => (
      <Link to={'customer/' + record.customerId}>{text}</Link>
    ) },
    { title: 'Description', dataIndex: 'description' }
  ]

  onDateRangeChanged = async (dates, dateStrings) => {
    try {
      let response = await wfetch({ path: `/transaction?drs=${dateStrings[0]}&dre=${dateStrings[1]}` })
      if (!response.ok) {
        throw new ResponseError(''. response)
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
        throw new ResponseError(''. response)
      } else {
        let blob = await response.blob()
        saveAs(blob, 'report.csv')
      }
    } catch (err) {
      // TODO: Better error handling.
      console.log(err)
    }


    let blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"})

  }

  render() {
    return (
      <div>
        <div>
          <RangePicker onChange={this.onDateRangeChanged} />
        </div>
        <Button onClick={this.downloadCsvReport}>Download report</Button>
        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }
}


export default Reports

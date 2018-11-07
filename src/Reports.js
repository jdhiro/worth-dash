import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Table, Input, Select } from 'antd'
import { wfetch } from './utils/wfetch'

const { Content } = Layout
const { Search } = Input
const InputGroup = Input.Group
const Option = Select.Option

class Reports extends Component {
  render() {
    return (
      <div>
        <a href='reports/lastDay'>foo</a>
        <Link to='reports/lastDay'>Last Day</Link>
        Last Month
      </div>
    )
  }
}


export default Reports

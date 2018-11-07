import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Layout, Table, Input, Select } from 'antd'
import { wfetch } from './utils/wfetch'

const { Content } = Layout
const { Search } = Input
const InputGroup = Input.Group
const Option = Select.Option

class CardSearch extends Component {
  render() {
    return (
      <div>
        <h1>Add a Card</h1>
        <p><strong>Coming soon!</strong> Cards will be seperated from customers. In the mean time, add a customer with first name "GIFT" and last name "CARD". These accounts will be migrated later.</p>
      </div>
    )
  }
}


export default CardSearch

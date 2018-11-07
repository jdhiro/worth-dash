import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { message, Layout, Table, Input, Select } from 'antd'
import { wfetch } from './utils/wfetch'

const { Content } = Layout
const { Search } = Input
const InputGroup = Input.Group
const Option = Select.Option

class CardSearch extends Component {
  state = {
    query: '',
    results: []
  }

  handleSearch = async (val, e) => {
    try {
      let response = await wfetch({ path: `/card/${val}` })
      if (!response.ok) {
        throw response.statusText
      }
      let json = await response.json()
      this.props.history.push(`/customer/${json.id}`)
    } catch(err) {
      message.error('Unable to find card.')
    }
  }

  render() {
    return (
      <div>
        <h1>Search for a Gift Card</h1>
      <Search size='large' placeholder='Enter a card number' enterButton onSearch={this.handleSearch} />
      </div>
    )
  }
}


export default CardSearch

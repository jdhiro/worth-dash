import React, { Component } from 'react'
import { message, Input } from 'antd'
import { wfetch } from './utils/wfetch'

const { Search } = Input

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

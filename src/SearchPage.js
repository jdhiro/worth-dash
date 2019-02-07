import React from 'react'
import { wfetch, NetworkError, ResponseError } from './utils/wfetch'
import { Link } from 'react-router-dom'
import { Table, Input } from 'antd'

const { Search } = Input

export default class SearchPage extends React.Component {

  state = {
    query: '',
    results: []
  }

  mode = {
    NAME: 1,
    PHONE: 2,
    CARD: 3,
  }

  handleInputChange = async (e) => {


    


    const v = e.target.value




    this.setState({query: e.target.value})




    console.log(e.target.value)

  }

  handleSubmit = async (val, e) => {
    let response = await wfetch({ path: `/search?q=${val}` })
    if (!response.ok) {
      throw new ResponseError('', response)
    } else {
      let json = await response.json()
      this.setState({ results: json })
    }
  }

  render() {
    return(
      <div>
        <Search size='large' enterButton='Search' onChange={this.handleInputChange} value={this.state.query} />
        <Table columns={this.columns} dataSource={this.state.results} rowKey='id' style={{ marginTop: '15px' }} />
      </div>
    )
  }


}

import React, { Component } from 'react'
import Login from './Login'
import CustomerSearch from './CustomerSearch'
import CustomerDetail from './CustomerDetail'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import './App.css';

const { Header, Content } = Layout

class App extends Component {
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} style={{ lineHeight: '64px' }} >
            <Menu.Item key="1"><Link to='/customer-search'>Customers</Link></Menu.Item>
            <Menu.Item key="2">Cards</Menu.Item>
            <Menu.Item key="3"><Link to='/transactions'>Transactions</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '50px' }}>
          <Route path='/login' component={Login} />
          <Route path='/customer-search' component={CustomerSearch} />
          <Route path='/customer/:id' component={CustomerDetail} />
        </Content>
      </Layout>
    )
  }
}

export default App;

import React, { Component } from 'react'
import Login from './Login'
import CustomerSearch from './CustomerSearch'
import CustomerDetail from './CustomerDetail'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import './App.css';

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path='/login' component={Login} />
          <PrivateRoute component={Main} />
        </Switch>
      </Router>
    )
  }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
       sessionStorage.getItem('token') !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

const Main = () => (
  <Layout style={{ minHeight: '100vh' }}>
    {Sider}
    <Content>
      <Route path='/customer-search' component={CustomerSearch} />
      <Route path='/customer/:id' component={CustomerDetail} />
    </Content>
  </Layout>
)

const SideBar = () => (
  <Sider>
    <div className="logo" />
    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
      <SubMenu key="sub1" title={<span><Icon type="user" /><span>Customers</span></span>} >
        <Menu.Item key="3">Search</Menu.Item>
        <Menu.Item key="4">Add customer</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        title={<span><Icon type="line-chart" /><span>Analytics</span></span>}
      >
        <Menu.Item key="6">Team 1</Menu.Item>
        <Menu.Item key="8">Team 2</Menu.Item>
      </SubMenu>
      <SubMenu
        key="sub2"
        title={<span><Icon type="line-chart" /><span>Settings</span></span>}
      >
        <Menu.Item key="6">Sign out</Menu.Item>
        <Menu.Item key="8">Team 2</Menu.Item>
      </SubMenu>
    </Menu>
  </Sider>
)



export default App

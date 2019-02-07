import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'

const SubMenu = Menu.SubMenu

class SideMenu extends Component {

  push = this.props.history.push
  keyActions = {
    'search': (k) => this.push(`/${k}`),

    'customer-search': (k) => this.push(`/${k}`),
    'customer-add': (k) => this.push(`/${k}`),

    'card-search': (k) => this.push(`/${k}`),
    'card-add': (k) => this.push(`/${k}`),
    'card-add-bulk': (k) => this.push(`/${k}`),

    'analytics': (k) => this.push(`/${k}`),

    'reports': (k) => this.push(`/${k}`),

    'settings-logout': () => {
      sessionStorage.removeItem('token')
      this.props.history.push('/login')
    },
  }

  handleClick = ({ key }) => {
    this.keyActions[key](key)
  }

  getLocationKey = () => {
    const match = this.props.location.pathname.match(/[a-z-]+/)
    return match ? [match[0]] : []
  }

  render() {
    return (
      <Menu
        style={{height: '100%', paddingTop: '24px'}}
        defaultOpenKeys={['customer', 'card']}
        defaultSelectedKeys={this.getLocationKey()}
        mode='inline' onClick={this.handleClick}
        >
        <Menu.Item key='search'><Icon type='search' /> Search</Menu.Item>
        <SubMenu key='customer' title={<span><Icon type='user' /><span>Customers</span></span>} >
          <Menu.Item key='customer-search'>Search</Menu.Item>
          <Menu.Item key='customer-add'>Add</Menu.Item>
        </SubMenu>
        <SubMenu key='card' title={<span><Icon type='gift' /><span>Gift Cards</span></span>} >
          <Menu.Item key='card-search'>Search</Menu.Item>
          <Menu.Item key='card-add'>Add</Menu.Item>
        </SubMenu>
        {/* <Menu.Item key='analytics'><span><Icon type='line-chart' /><span>Analytics</span></span></Menu.Item> */}
        <Menu.Item key='reports'><span><Icon type='solution' /><span>Reports</span></span></Menu.Item>
        <SubMenu key='settings' title={<span><Icon type='setting' /><span>Settings</span></span>} >
          <Menu.Item key='settings-logout'>Sign out</Menu.Item>
        </SubMenu>
      </Menu>
    )
  }

}

export default withRouter(SideMenu)

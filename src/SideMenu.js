import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import { Icon } from '@ant-design/compatible'

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

    'settings-stores': (k) => this.push(`/${k}`),
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
        defaultOpenKeys={['customer', 'card', 'settings']}
        defaultSelectedKeys={this.getLocationKey()}
        mode='inline' onClick={this.handleClick}
        >
        <Menu.Item key='customer-search'><Icon type='search' /> Search</Menu.Item>
        <Menu.Item key='customer-add'><Icon type='user-add' /> Add customer</Menu.Item>
        <Menu.Item key='card-add'><Icon type='credit-card' /> Add card</Menu.Item>
        <Menu.Item key='reports'><span><Icon type='solution' /><span>Reports</span></span></Menu.Item>
        <Menu.Item key='settings-stores'><Icon type='setting' /> Manage stores</Menu.Item>
        <Menu.Item key='settings-logout'><Icon type='logout' /> Sign out</Menu.Item>
      </Menu>
    )
  }

}

export default withRouter(SideMenu)

import React, { Component } from 'react'
import { withRouter, useLocation, useHistory } from 'react-router-dom'
import { Menu } from 'antd'
import { Icon } from '@ant-design/compatible'

export default function() {
  let location = useLocation()
  let history = useHistory()

  let keyActions = {
    'search': (k) => history.push(`/${k}`),

    'customer-search': (k) => history.push(`/${k}`),
    'customer-add': (k) => history.push(`/${k}`),

    'card-search': (k) => history.push(`/${k}`),
    'card-add': (k) => history.push(`/${k}`),
    'card-add-bulk': (k) => history.push(`/${k}`),

    'analytics': (k) => history.push(`/${k}`),

    'reports': (k) => history.push(`/${k}`),

    'settings-stores': (k) => history.push(`/${k}`),
    'settings-logout': () => {
      sessionStorage.removeItem('token')
      history.push('/login')
    },
  }

  let handleClick = ({ key }) => {
    keyActions[key](key)
  }

  let getLocationKey = () => {
    const match = location.pathname.match(/[a-z-]+/)
    return match ? [match[0]] : []
  }

  return (
    <Menu
      style={{height: '100%', paddingTop: '24px'}}
      defaultOpenKeys={['customer', 'card', 'settings']}
      defaultSelectedKeys={getLocationKey()}
      mode='inline' onClick={handleClick}
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

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import logo from '../logo.png'

const { Sider } = Layout

export default function() {
  let location = useLocation()
  let navigate = useNavigate()

  const items = [
    { label: 'Customers', key: 'customer' },
    { label: 'Add Customer', key: 'customer-add' },
    { label: 'Add Card', key: 'card-add' },
    { label: 'Reports', key: 'reports' },
    { label: 'Manage Stores', key: 'settings-stores' },
    { label: 'Sign Out', key: 'logout' },
  ]

  return (
    <Sider>
      <div className="logo" style={{margin: 24}}>
        <img src={logo} style={{width: '100%'}}></img>
      </div>
      <Menu theme="dark"
        defaultOpenKeys={['customer', 'card', 'settings']}
        defaultSelectedKeys={location.pathname.match(/[a-z-]+/)[0]}
        mode='inline'
        onSelect={({ key }) => navigate('/'+key)}
        items={items}
      />
    </Sider>
  )
}

import React, { useEffect, useState } from 'react'
import { CustomerSearch, CustomerAdd, CustomerDetail, CardAdd, LoginPage, Reports, SideMenu, SettingsStoresPage } from './components'
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Button, Card, Col, Form, Input, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import http from './utils/http'


/**
 * Create a standard auth login/logout implimentation. There is no React code here.
 */
 class BaseAuthProvider {
  static async login(username, password) {
    // FIXME: This is a login hack to prevent the store from logging
    // into the UCL dashboard. Remove this after migration is complete.
    if (username === 'ucljuanita' || username === 'uclslater') {
      throw {name: 'AccountError', description: 'Not a valid admin account.'}
    }

    try {
      const response = await http.post('/auth', {username, password})
      return response.data      
    } catch (e) {
      console.log(e)
      throw {name: 'HttpResponseError', res: e.response}
    }
  }
}

/**
 * Create a React Context for auth, so that the auth state can be shared at the global level.
 */
const AuthContext = React.createContext(null)

/**
 * Configure the React provider, which provides state and methods down through the React tree.
 */
const AuthProvider = ({ children }) => {
  const localToken = localStorage.getItem('token') ?? null
  const [token, setToken] = React.useState(localToken)
  http.defaults.headers.common['Authorization'] = 'Bearer ' + token

  const login = async (username, password) => {
    const data = await BaseAuthProvider.login(username, password)
    setToken(data.token)
    localStorage.setItem('token', data.token)
    http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token
  }

  const logout = async () => {
    setToken(null)
    localStorage.removeItem('token')
    delete http.defaults.headers.common['Authorization']
  }

  const value = {
    token,
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Following best practices, expose AuthContext into our own hook.
 */
const useAuth = () => {
  return React.useContext(AuthContext)
}

/**
 * This React component requires an auth token to be present. If there is none, redirect to the login page.
 */
function RequireAuth({ children }) {
  const { token } = useAuth()
  let location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export { AuthProvider, RequireAuth, useAuth }
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Button, Card, Col, Form, Input, Row } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { AuthProvider, RequireAuth, useAuth } from '../auth'

function LogoutPage() {
  let navigate = useNavigate()
  let auth = useAuth()
  useEffect(() => {
    (async function logout() {
      await auth.logout()
      navigate('/login', { replace: true })
    })()
  }, [])
  return (<div></div>)
}

export default LogoutPage
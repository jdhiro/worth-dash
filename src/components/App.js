import React, { useEffect, useState } from 'react'
import { Customers, Cards, CustomerAdd, CustomerDetail, CardAdd, LoginPage, LogoutPage, Reports, SideMenu, SettingsStoresPage } from '.'
import { BrowserRouter, Routes, Route, Outlet, useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import { AuthProvider, RequireAuth, useAuth } from '../auth'

const { Content } = Layout

console.log("ENV: " + process.env.NODE_ENV)

/**
 * The "Main" component wrapps the app to provide a sidebar to the rest of the app.
 */
function Main() {
  return(
    <Layout style={{height: '100vmin'}}>
      <Layout>
        <SideMenu />
        <Content style={{padding: '24px 48px'}}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

/**
 * The primary app component.
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Main />}>
              <Route path='customer' element={<Customers/>} />
              <Route path='card' element={<Cards/>} />
              <Route path='customer/:id' element={<CustomerDetail/>} />
              <Route path='customer-add' element={<CustomerAdd/>} />
              <Route path='card-add' element={<CardAdd/>} />
              <Route path='reports' element={<Reports/>} />
              <Route path='settings-stores' element={<SettingsStoresPage/>} />
            </Route>
          </Route>
          <Route path="*" element={<p>There's nothing here!</p>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
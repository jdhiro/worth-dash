import './App.css'
import React, { Component } from 'react'
import ErrorBoundary from './ErrorBoundary'
import Login from './Login'
import CustomerSearch from './CustomerSearch'
import CustomerAdd from './CustomerAdd'
import CustomerDetail from './CustomerDetail'
import CardAdd from './CardAdd'
import Reports from './Reports'
import SideMenu from './SideMenu'
import SettingsStoresPage from './SettingsStores'

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

console.log("ENV: " + process.env.NODE_ENV)

const { Header, Content, Sider } = Layout

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Switch>
            <Route path='/login'>
              <Login />
            </Route>
            <Main />
          </Switch>
        </Router>
      </ErrorBoundary>
    )
  }
}

class Main extends Component {
  render() {
    return(

      <Layout style={{height: '100vmin'}}>
        <Header><div className="logo">Urban Coffee Lounge</div></Header>
        <Layout>
          <Sider theme='light' style={{height: '100%'}}>
            <SideMenu />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content>
              <Switch>
                <PrivateRoute path='/search'>
                  <CustomerSearch/>
                </PrivateRoute>
                <PrivateRoute path='/customer-search'>
                  <CustomerSearch/>
                </PrivateRoute>
                <PrivateRoute path='/customer-add'>
                  <CustomerAdd/>
                </PrivateRoute>
                <PrivateRoute path='/customer/:id'>
                  <CustomerDetail/>
                </PrivateRoute>
                <PrivateRoute path='/card-add'>
                  <CardAdd/>
                </PrivateRoute>
                <PrivateRoute path='/reports'>
                  <Reports/>
                </PrivateRoute>
                <PrivateRoute path='/settings-stores'>
                  <SettingsStoresPage/>
                </PrivateRoute>
                <Redirect exact to='/search'>
                </Redirect>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </Layout>

    )
  }
}


const isAuthenticated = () => {
  const token = sessionStorage.getItem('token')
  return (token) ? true : false
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
)

class NotFound extends Component {
  render() {
    return(
      <div>Page Not Found</div>
    )
  }
}

export default App

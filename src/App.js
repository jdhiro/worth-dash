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

import { BrowserRouter as Router, Redirect, Route, Switch, Link } from 'react-router-dom'
import { Layout } from 'antd'


const { Header, Content, Sider } = Layout

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Router>
          <Switch>
            <Route path='/login' component={Login} />
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
        {/*<Header style={{backgroundColor: '#DDD'}}><h2>Worth</h2></Header>*/}
        <Layout>
          <Sider theme='light' style={{height: '100%'}}>
            <SideMenu />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content>
              <Switch>
                <PrivateRoute path='/search' component={CustomerSearch} />
                <PrivateRoute path='/customer-search' component={CustomerSearch} />
                <PrivateRoute path='/customer-add' component={CustomerAdd} />
                <PrivateRoute path='/customer/:id' component={CustomerDetail} />
                <PrivateRoute path='/card-add' component={CardAdd} />
                <PrivateRoute path='/reports' component={Reports} />
                <PrivateRoute path='/settings-stores' component={SettingsStoresPage}/>
                <Redirect exact to='/search' />
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

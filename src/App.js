import './App.css'
import React, { Component } from 'react'
import ErrorBoundary from './ErrorBoundary'
import Login from './Login'
import CustomerSearch from './CustomerSearch'
import CustomerAdd from './CustomerAdd'
import CustomerDetail from './CustomerDetail'
import CardSearch from './CardSearch'
import CardAdd from './CardAdd'
import Reports from './Reports'
import SideMenu from './SideMenu'
//import PrivateRoute from './PrivateRoute'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Layout } from 'antd'
import Exception from 'ant-design-pro/lib/Exception'

const { Content } = Layout

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
      <Layout style={{ minHeight: '100vh' }}>
        <SideMenu />
        <Content style={{ padding: '50px' }}>
          <Switch>
            <Route path='/customer-search' component={CustomerSearch} />
            <Route path='/customer-add' component={CustomerAdd} />
            <Route path='/customer/:id' component={CustomerDetail} />
            <Route path='/card-search' component={CardSearch} />
            <Route path='/card-add' component={CardAdd} />
            <Route path='/reports' component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </Content>
      </Layout>
    )
  }
}

class NotFound extends Component {
  render() {
    return(
      <Exception type='404' desc='Sorry, page not found.' actions={<Link to='/'>Return home</Link>}/>
    )
  }
}

export default App

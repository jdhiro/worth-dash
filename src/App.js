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
import SearchPage from './SearchPage'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Layout } from 'antd'
import Exception from 'ant-design-pro/lib/Exception'

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
        <Header style={{backgroundColor: 'lightGrey'}}>Worth</Header>
        <Layout>
          <Sider theme='light' style={{height: '100%'}}>
            <SideMenu />
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content>
              <Switch>
                <Route path='/search' component={SearchPage} />
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
        </Layout>
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

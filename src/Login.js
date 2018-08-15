import React, { Component } from 'react'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = { username: '', password: '' }
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  handleSubmit = async (e) => {
    e.preventDefault()

    const { username, password } = this.state
    const params = { username, password }
    const urlParams = new URLSearchParams(Object.entries(params))

    try {
      let response = await fetch('http://0.0.0.0:8081/auth/login?' + urlParams, {
        method: 'POST'
      })
      if (response.ok) {
        let json = await response.json()
        sessionStorage.setItem('token', json.token)
        this.props.history.push('/customer-search')
      }
    } catch (err) {
      console.log(err)
    }
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
        </label>
        <label>
          Password:
          <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default Login

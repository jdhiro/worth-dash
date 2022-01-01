let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api.wrth.io'
} else {
  baseUrl = 'http://localhost:8081'
}

baseUrl = 'https://worth-server-k9njp.ondigitalocean.app'

let token = null

class NetworkError extends Error {}

class ResponseError extends Error {
  constructor (message, res) {
    super(message)
    Error.captureStackTrace( this, this.constructor )
    this.name = 'ResponseError'
    this.res = res
  }
}

function getHeaders() {
  if (token === null) {
    token = sessionStorage.getItem('token')
  }
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'Bearer ' + token
  }
}

const wfetch = async ({ path, method, body }) => {
  const bodyString = JSON.stringify(body)
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: method || 'GET',
      headers: getHeaders(),
      body: bodyString
    })
    return response
  } catch (err) {
    if (err instanceof TypeError) throw new NetworkError(err)
    else throw err
  }
}

const wget = async (path) => {
  return await wfetch({ path })
}

const wpost = async (path, body) => {
  return await wfetch({ path, method: 'POST', body })
}

const wput = async (path, body) => {
  return await wfetch({ path, method: 'PUT', body })
}

export { NetworkError, ResponseError, wfetch, wget, wpost, wput }

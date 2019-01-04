let baseUrl = ''
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://worthfu.com:444'
} else {
  baseUrl = 'http://localhost:8081'
}

let token = null

function getHeaders() {
  if (token === null) {
    token = sessionStorage.getItem('token')
  }
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    'Authorization': 'bearer ' + token
  }
}

const wfetch = async ({ path, method = 'GET', body }) => {
  const bodyString = JSON.stringify(body)
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: getHeaders(),
    body: bodyString
  })
  if (response.status === 401) {
    sessionStorage.clear()
    // TODO: Go to login screen and clear history.
  }
  return response
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



export { wfetch, wget, wpost, wput }

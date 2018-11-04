
const baseUrl = 'http://0.0.0.0:8081'
const token = sessionStorage.getItem('token')
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Authorization': `bearer ${token}`
}

const wfetch = async ({ path, method = 'GET', body }) => {
  const bodyString = JSON.stringify(body)
  const response = await fetch(`${baseUrl}${path}`, { method, headers, body: bodyString })
  if (response.status === 401) {
    console.log('Unauthorized.')
    sessionStorage.clear()
  }
  return response
}

const get = async (path) => {
  return await wfetch({ path })
}

const post = async (path, body) => {
  return await wfetch({ path, method: 'POST', body })
}

const put = async (path, body) => {
  return await wfetch({ path, method: 'PUT', body })
}



export { wfetch, get, post, put }

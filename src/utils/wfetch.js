
const baseUrl = 'http://0.0.0.0:8081'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1Y2wiLCJpYXQiOjE1MzMwMTg2MjB9.JpbwrmXx3YWD2bwmdc2pa3vf3X-vDkBzsQhqw55yUco'

const get = async (path) => {
  return await fetch(`${baseUrl}${path}`, {
    headers: { 'Authorization': `bearer ${token}` }
  })
}

const post = async (path, body) => {
  return await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(body)
  })
}

const put = async (path, body) => {
  return await fetch(`${baseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `bearer ${token}`
    },
    body: JSON.stringify(body)
  })
}



export { get, post, put }

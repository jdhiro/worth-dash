import axios from 'axios'

let baseURL = 'http://localhost:8081'

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://api.wrth.io'
} else {
  baseURL = 'http://localhost:8081'
}

baseURL = 'https://worth-server-k9njp.ondigitalocean.app'

const ax = axios.create({
  baseURL,
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8'}
})

try {
    ax.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
} catch (e) {

}

export default ax
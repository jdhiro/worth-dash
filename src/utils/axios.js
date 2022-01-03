import axios from 'axios'

let baseURL = 'https://api.wrth.io'

const ax = axios.create({
  baseURL,
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8'}
})

try {
    ax.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
} catch (e) {

}

export default ax
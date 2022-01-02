import axios from 'axios'

let baseUrl = 'https://api.wrth.io'

const ax = axios.create({
  baseUrl,
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8'}
})

try {
    ax.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
} catch (e) {

}

export default ax
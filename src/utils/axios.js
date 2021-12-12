import axios from 'axios'

const ax = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8'}
})

try {
    ax.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token')
} catch (e) {

}

export default ax
import axios from 'axios'

let baseURL = 'https://api.wrth.io'

const http = axios.create({
  baseURL,
  headers: {'Accept': 'application/json', 'Content-Type': 'application/json; charset=utf-8'}
})

export default http
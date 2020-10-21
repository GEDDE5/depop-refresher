const axios = require('axios')

const handleResponse = response => response.data

const handleResponseError = ({
  config: { url = '' } = {},
  message,
  response: { status = NaN, data = {} } = {},
}) => {
  console.log(`[${url}] ${message}`)
  console.log(' =>', data)
}

const handleRequest = config => {
  if (config.token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${config.token}`
    // eslint-disable-next-line no-param-reassign
    config.token = ''
  }
  return config
}

module.exports = baseURL => {
  const instance = axios.create({ baseURL })
  instance.interceptors.response.use(handleResponse, handleResponseError)
  instance.interceptors.request.use(handleRequest)
  instance.set = (key, value) => {
    instance.defaults[key] = value
  }
  return instance
}

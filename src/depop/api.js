const axios = require('axios')
const api = axios.create({
  baseURL: 'http://asdf.com',
  headers: {
    'content-type': 'application/json',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:87.0) Gecko/20100101 Firefox/87.0',
  },
  validateStatus: status => status >= 200 && status < 500,
})

const setToken = config => {
  if (config.token) {
    const { token, ...rest } = config
    // eslint-disable-next-line no-param-reassign
    config.headers.authorization = `Bearer ${token}`
    return rest
  }

  return config
}

api.interceptors.request.use(setToken)
api.interceptors.response.use(({ data }) => data)

module.exports = api

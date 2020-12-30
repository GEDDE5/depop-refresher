const axios = require('axios')
const api = axios.create({
  baseURL: 'http://asdf.com',
  headers: { 'content-type': 'application/json' },
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

// const Fetch = require('../fetch')

// const api = new Fetch()

// const stringifyBodyOnPost = config => {
//   if (config.body) {
//     return {
//       ...config,
//       body: JSON.stringify(config.body),
//     }
//   }
//   return config
// }
// const setToken = config => {
//   if (config.token) {
//     const { token, ...rest } = config
//     config.headers.append('authorization', `Bearer ${token}`)
//     return rest
//   }

//   return config
// }

// api.middlewares.beforeRequest.use(setToken, stringifyBodyOnPost)
// api.middlewares.afterResponse.use(response => response.json())
// api.config.headers.append('content-type', 'application/json')

// module.exports = api

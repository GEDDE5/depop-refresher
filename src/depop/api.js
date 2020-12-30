const Fetch = require('../fetch')

const api = new Fetch()

const stringifyBodyOnPost = config => {
  if (config.body) {
    return {
      ...config,
      body: JSON.stringify(config.body),
    }
  }
  return config
}
const setToken = config => {
  if (config.token) {
    const { token, ...rest } = config
    config.headers.append('authorization', `Bearer ${token}`)
    return rest
  }

  return config
}

api.middlewares.beforeRequest.use(setToken, stringifyBodyOnPost)
api.middlewares.afterResponse.use(response => response.json())
api.config.headers.append('content-type', 'application/json')

module.exports = api

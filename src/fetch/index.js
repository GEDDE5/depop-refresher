const Middleware = require('./Middleware')

module.exports = class Fetch {
  constructor({ baseURL = '' } = {}) {
    this.initializeMethods('GET', 'POST', 'PUT')

    this.config = {
      headers: new Headers(),
      query: new URLSearchParams(),
      baseURL,
    }

    this.middlewares = {
      beforeRequest: new Middleware(),
      onRequestError: new Middleware(),
      onResponseError: new Middleware(),
      afterResponse: new Middleware(),
    }
  }

  initializeMethods(...methods) {
    methods.forEach(method => {
      this[method.toLowerCase()] = (url, init) =>
        this.fetch(url, { ...init, method })
    })
  }

  /**
   * Syntehsizes the Uniform Resource Locator
   * @param {String} path The basename + path — or just the path
   * @param {Object} _params Parameters from which to build a query string
   */
  buildURL(path = '', _params = {}) {
    let {
      config: { baseURL },
    } = this

    /**
     * asdf.com --> asdf.com/
     */
    baseURL = baseURL && (baseURL.slice(-1) === '/' ? baseURL : `${baseURL}/`)

    /**
     * `path` can be the full URL if `baseURL` wasn't defined, so path isn't well named
     * TODO: improve it somehow
     */
    const url = new URL(baseURL + path)

    /**
     * Transform `_params` object into query string
     */
    const params = new URLSearchParams()
    Object.keys(_params).forEach(key => params.set(key, _params[key]))
    url.search = params
    return new URL(url)
  }

  /**
   * Builds URL, executes hooks, and fetches remote data
   * @param {String} path Represents a full or partial URL
   * @param {Object} init User-generated coniguration, eg. headers, mode, body
   *
   * @example
   *
   *    fetch.post('login', { body: })
   */
  async fetch(path = '', init = {}) {
    const { beforeRequest, afterResponse } = this.middlewares

    // Clear body for every new request
    this.config = (({ body, ...rest }) => rest)(this.config)

    /**
     * Put in base-config + user-generated config and get out
     * config ready for fetch (note the argument order here)
     */
    this.config = beforeRequest.using({ ...this.config, ...init })

    this.url = this.buildURL(path, init.params)

    /**
     * Instantiate a Request by building a URL and passing in a config
     */
    const request = new Request(this.url, this.config)

    /**
     * Return data after executing hook once response is received from fetch
     */
    return afterResponse.using(await fetch(request))
  }
}

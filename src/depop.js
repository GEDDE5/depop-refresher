const Bottleneck = require('bottleneck')

const api = require('./api')('https://webapi.depop.com/api/auth/v1/')
const log = require('./log/error')

module.exports = class Depop {
  constructor({
    username = '',
    password = '',
    refreshInterval = 100,
    maxConcurrentRefreshes = 3,
  }) {
    this.username = username
    this.products = []
    this.limiter = new Bottleneck({
      maxConcurrent: maxConcurrentRefreshes,
      minTime: refreshInterval,
    })

    return (async () => {
      await api
        .post('login', { username, password })
        .then(({ token }) => api.set('token', token))
        .catch(log('login'))
      this.user = await api.get('me').catch(log('me'))
      api.set('baseURL', 'https://webapi.depop.com/api/v1/')
      await this.populateProducts()
      return this
    })()
  }

  async populateProducts({ limit = 200 } = {}) {
    let path = `shop/${this.username}`
    const { id } = await api.get(path).catch(log(path))

    path = `shop/${id}/products/`

    const fetchProducts = async (offsetId = '') => {
      const fetched = await api
        .get(path, { params: { limit, offset_id: offsetId } })
        .catch(log(path))

      this.products.push(...(fetched.products || []))

      if (fetched.products.length === limit) {
        await fetchProducts(fetched.meta.last_offset_id)
      }
    }

    return fetchProducts()
  }

  static async refresh({ slug = '' } = {}) {
    let path = `products/${slug}`
    const { id, slug: _, status, pictures, ...rest } = await api
      .get(path)
      .catch(log(path))
    const body = {
      pictureIds: pictures.map(({ id: pictureId }) => pictureId),
      ...rest,
    }
    path = `products/${slug}`
    return api.put(path, body).catch(log(path))
  }

  refreshSelected(products = []) {
    return Promise.all(products.map(this.limiter.wrap(this.refresh))).catch(
      log('Refresh selected')
    )
  }

  refreshAll() {
    const availableProducts = this.products
      .filter(product => product.sold === false)
      .slice(0, 1)
    return this.refreshSelected(availableProducts)
  }
}

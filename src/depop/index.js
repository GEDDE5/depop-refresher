require('dotenv').config()

const Bottleneck = require('bottleneck')

const api = require('./api')
const log = require('../log/error')

module.exports = class Depop {
  constructor(user, products) {
    this.user = user
    this.products = products
    this.limiter = new Bottleneck({
      maxConcurrent: 3, // Or max concurrent refreshes
      minTime: 100, // Or refresh interval
    })
  }

  static async login(username = '', password = '', _token = '') {
    api.defaults.baseURL = 'https://webapi.depop.com/api/auth/v1'

    if (_token) {
      api.defaults.token = _token
    } else {
      // Get token and place it in API config (hook will auto set it)
      await api
        .post('login', { username, password })
        .then(({ token }) => {
          api.defaults.token = token
        })
        .catch(log('login'))
    }

    // Fetch user details
    const user = await api.get('me')

    // Populate products
    const products = await this.populateProducts(username)

    return new Depop(user, products)
  }

  static async populateProducts(username, { limit = 200 } = {}) {
    api.defaults.baseURL = 'https://webapi.depop.com/api/v1'

    let path = `/shop/${username}`
    const { id } = await api.get(path).catch(log(path))

    path = `/shop/${id}/products`
    const products = []
    // Recurse until prods are props
    const fetchProducts = async (offsetId = '') => {
      const fetched = await api
        .get(path, { params: { limit, offset_id: offsetId } })
        .catch(log(path))

      products.push(...(fetched.products || []))

      if (fetched.products.length === limit) {
        await fetchProducts(fetched.meta.last_offset_id)
      }

      return products
    }

    return fetchProducts()
  }

  refreshSelected(products = []) {
    async function refresh({ slug }) {
      let path = `/products/${slug}`
      const res = await api.get(path).catch(log(path))
      if (res.code) {
        console.error(`Error ${res.code}: ${slug} - ${res.message}`)
        return Promise.resolve(false)
      }
      const { id, slug: _, status, pictures, ...rest } = res
      const body = {
        pictureIds: pictures.map(({ id: pictureId }) => pictureId),
        ...rest,
      }
      path = `/products/${slug}`
      return api.put(path, { ...body }).catch(log(path))
    }

    return Promise.all(products.map(this.limiter.wrap(refresh))).catch(
      log('Refresh selected')
    )
  }

  refreshAll() {
    const availableProducts = this.products
      .filter(product => product.sold === false)
      .slice(0, 10)
      .reverse()
    return this.refreshSelected(availableProducts)
  }
}

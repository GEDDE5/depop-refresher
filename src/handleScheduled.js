/* globals DEPOP_USERNAME DEPOP_PASSWORD */

const Depop = require('./depop')
const notify = require('./discord')

async function handleScheduled() {
  let refreshed

  if (DEPOP_USERNAME && DEPOP_PASSWORD) {
    const store = await Depop.login(
      DEPOP_USERNAME,
      DEPOP_PASSWORD,
      'd0cec375fe6d9f7bf8dcee54f8e6c8241ab78136'
    )
    const result = await store.refreshAll()
    const numSuccessfullyRefreshed = result.filter(product => Boolean(product))
      .length
    await notify({ ...store, numSuccessfullyRefreshed })
    refreshed = numSuccessfullyRefreshed
  } else {
    refreshed = 'Error'
  }

  const config = {
    headers: { 'content-type': 'application/json' },
  }
  const body = JSON.stringify({ refreshed })
  return new Response(body, config)
}

exports.handleScheduled = handleScheduled

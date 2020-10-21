const Depop = require('./depop')
// const send = require('./log/discord')

/* eslint-disable */
addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event))
})
/* eslint-enable */

/* eslint-disable */
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})
/* eslint-enable */

async function handleScheduled() {
  const { user, products, refreshAll } = await new Depop({
    /* eslint-disable */
    username: DEPOP_USERNAME,
    password: DEPOP_PASSWORD,
    /* eslint-enable */
  })

  const result = await refreshAll()

  // await send({ result, products, user })
}

async function handleRequest() {
  let success

  // eslint-disable-next-line no-undef
  if (DEPOP_USERNAME && DEPOP_PASSWORD) {
    const { user, products, refreshAll } = await new Depop({
      /* eslint-disable */
      username: DEPOP_USERNAME,
      password: DEPOP_PASSWORD,
      /* eslint-enable */
    })
    const result = await refreshAll()
    console.log(result)
    // await send({ result, products, user })

    success = true
  } else {
    success = false
  }

  const body = JSON.stringify({ success })
  const config = {
    headers: { 'content-type': 'application/json' },
  }
  // eslint-disable-next-line no-undef
  return new Response(body, config)
}

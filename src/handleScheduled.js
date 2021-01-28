const Depop = require('./depop')
const notify = require('./discord')

async function handleScheduled() {
  const store = await Depop.login(
    process.env.DEPOP_USER,
    process.env.DEPOP_PASS,
    '4eae754da873a66667c0f748f129e68ed252f073'
  )
  const result = await store.refreshAll()
  const numSuccessfullyRefreshed = result.filter(product => Boolean(product))
    .length
  console.log(`Refreshed — ${numSuccessfullyRefreshed} — products`)
  await notify({ ...store, numSuccessfullyRefreshed })
}

exports.handleScheduled = handleScheduled

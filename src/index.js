const { handleRequest } = require('./handleRequest')
const { handleScheduled } = require('./handleScheduled')

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event))
})

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event))
})

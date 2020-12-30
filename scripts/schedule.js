const cron = require('node-cron')
const main = require('../src')

cron.schedule('0 0,9-21/3 * * *', main, { timezone: 'America/New_York' })

require('dotenv').config()

const Webhook = require('./Webhook')
const template = require('./template')

const hook = new Webhook(process.env.DEPOP_WEBHOOK)
const { name } = require('../../package.json')
hook.username = name
hook.avatarUrl = 'https://i.imgur.com/4i9im75.png'

module.exports = params => hook.send(template(params))

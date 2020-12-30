/* globals WEBHOOK_URL */

const Webhook = require('./Webhook')
const template = require('./template')

const WEBHOOK_URL =
  'https://discord.com/api/webhooks/793658154206494750/NVabttft-zxWfJW3o3mhxVaO1atzKCdELvZfG5HODDvklHZDj3DWxcN-KhYks4ODDVVx'
const hook = new Webhook(WEBHOOK_URL)
const { name } = require('../../package.json')
hook.username = name
hook.avatarUrl = 'https://i.imgur.com/4i9im75.png'

module.exports = params => hook.send(template(params))

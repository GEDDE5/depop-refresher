const { create } = require('axios')
const headers = { 'content-type': 'application/json' }
const instance = create({ headers })

class Webhook {
  constructor(url) {
    this.url = url
    this._username = ''
  }

  set username(username) {
    this._username = username
  }

  set avatarUrl(url) {
    this._avatarUrl = url
  }

  send(_embed) {
    const body = {
      ...(this._username && { username: this._username }),
      ...(this._avatarUrl && { avatar_url: this._avatarUrl }),
      embeds: [_embed],
    }
    return instance.post(this.url, body)
  }
}

module.exports = Webhook

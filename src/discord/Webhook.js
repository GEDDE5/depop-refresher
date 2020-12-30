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
    const init = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    }
    return fetch(this.url, init)
  }
}

module.exports = Webhook

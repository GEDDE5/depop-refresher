module.exports = class Middleware {
  constructor() {
    this.fns = []
  }

  use(...fns) {
    this.fns = this.fns.concat(fns)
    return this.fns.length
  }

  using(subject) {
    return this.fns.reduce((x, y) => y(x), subject)
  }
}

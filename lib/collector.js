const request = require('request-promise'),
  retry = require('async-retry')

module.exports = class Collector {
  constructor(config, apiKey=require('config').apiKey) {
    this.config = config || require('config')
    this.config.apiKey = apiKey
    this.config.rawDir = require('config').rawDir
  }

  setWriter(writer) {
    this.writer = writer
  }

  validateRequest(res) {
    if (typeof res !== 'object' && res.length < 1) new Error('bad response')

    return res
  }

  async retryRequest(option) {
    return retry(async () => {
      const res = await request(option)

      return this.validateRequest(res)
    }, this.config.retryOpt)
  }

  // need to be implemented
  reformatter() {}
  async writer() {}
  async collect() {}
}

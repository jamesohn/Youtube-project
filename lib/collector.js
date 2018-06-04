const request = require('request-promise'),
  retry = require('async-retry'),
  Pqueue = require('p-queue')

module.exports = class Collector {
  constructor(config, apiKey=require('config').apiKey) {
    this.config = config || require('config')
    this.config.apiKey = apiKey
    this.config.rawDir = require('config').rawDir
    this.queue = new Pqueue(this.config.queueOpt || { concurrency: 10 })
  }

  setWriter(writer) {
    this.writer = writer
  }

  validateRequest(res) {
    if (typeof res !== 'object' && res.length < 1) new Error('bad response')

    return res
  }

  async retryRequest(option) {
    option.simple = false
    option.resolveWithFullResponse = true
    return retry(async bail => {
      const res = await request(option)

      if(res.statusCode === 403) {
        const errors = res.body.error.errors,
          currentKey = option.qs[this.config.apiKeyField || 'key']

        if(errors && typeof errors === 'object')
          for(let error of errors) {
            if(error.reason === 'dailyLimitExceeded'
              && this.config.apiKeys
              && this.config.apiKeyIndex < (this.config.apiKeys.length -1)
              && currentKey !== this.config.apiKeys[this.apiKeyIndex + 1]) {
                // key change
                this.config.apiKeyIndex += 1
                this.config.apiKey = this.config.apiKeys[this.config.apiKeyIndex]
            }
            if(currentKey !== this.config.apiKey) {
              option.qs[this.config.apiKeyField || 'key'] = this.config.apiKey
              return this.retryRequest(option)
            }
          }
      }
      if(res.statusCode >= 300) {
        res.body.option = option
        throw(res.body)
      }

      return this.validateRequest(res.body)
    }, this.config.retryOpt)
  }

  concurrencyCollect(...args) {
    const length = args.length
    let fail, success

    if(length > 2
      && typeof args[length - 1] === 'function'
      && typeof args[length - 2] === 'function') {
      fail = args.pop()
      success = args.pop()
    }

    if(!success || !fail)
      return this.queue.add(() => this.collect.apply(this, args))

    this.queue.add(() => this.collect.apply(this, args))
      .then(success)
      .catch(fail)
  }

  // need to be implemented
  reformatter() {}
  async writer() {}
  async collect() {}
}

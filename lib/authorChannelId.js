const collector = require('./collector'),
  deepCopy = require('./deep-copy'),
  stuff = require('./stuff.js'),
  fs = require('fs'),
  franc = require('franc'),
  Pqueue = require('p-queue'),
  Crawler = require('crawler'),
  crawlerOpt = require('./option.js'),
  pqueuecrawler = new Pqueue ({ concurrency:1000 }),
  crawler = new Crawler(crawlerOpt)


module.exports = class CommentThreads extends collector {
  async collect(channel) {
    let listOption = deepCopy(this.config.requestOpt);

    Object.assign(listOption.qs, {
      allThreadsRelatedToChannelId: channel,
      key: this.config.apiKey
    })

    await this.searchComment(channel,listOption)

    await pqueuecrawler.onIdle()
    return 'done'
  }

  async searchComment(channel,listOption) {
    let ids = new Set()

    while (ids.size < 50000) {
      let body = await this.retryRequest(listOption),
       nextPageToken = body.nextPageToken,
       prevPageToken
      // check response
      if (body === undefined || body.items === undefined || body.items.length < 1) break

      for (let item of body.items) {
        if (item !== undefined && item.snippet.topLevelComment.snippet !== undefined) {
          let authorChannelId = item.snippet.topLevelComment.snippet.authorChannelId.value
          let textDisplay = item.snippet.topLevelComment.snippet.textDisplay
          let url = `https://www.youtube.com/channel/${authorChannelId}/about`
          let language = franc(textDisplay, {minLength: 3})

          if(!ids.has(authorChannelId)) {
            ids.add(authorChannelId)
            pqueuecrawler.add(() => crawler.queue({uri: url, language: language, channel: channel, commentCount: ids.size}))
          }
        }
      }
      // change pageToken to nextPageToken
      if (nextPageToken !== undefined) listOption.qs.pageToken = nextPageToken
      if (nextPageToken === prevPageToken || nextPageToken === undefined) break
      prevPageToken = nextPageToken
      // console.log(channel, nextPageToken)
    }
  }

}

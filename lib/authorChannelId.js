const config = require('config'),
  collector = require('./collector'),
  deepCopy = require('./deep-copy'),
  stuff = require('./stuff'),
  fs = require('fs'),
  franc = require('franc'),
  Crawler = require('./crawler'),
  crawler = new Crawler(config)


module.exports = class CommentThreads extends collector {
  async collect(channel) {
    let listOption = deepCopy(this.config.requestOpt);

    Object.assign(listOption.qs, {
      allThreadsRelatedToChannelId: channel,
      key: this.config.apiKey
    })

    await this.searchComment(channel,listOption)
    await crawler.onIdle()
    await crawler.delObj(channel)
    return `${channel} locale done`
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
        try {
          if (item !== undefined && item.snippet.topLevelComment.snippet !== undefined) {
            let authorChannelId = item.snippet.topLevelComment.snippet.authorChannelId.value
            let textDisplay = item.snippet.topLevelComment.snippet.textDisplay

            if(!ids.has(authorChannelId)) {
              ids.add(authorChannelId)
              crawler.concurrencyCollect(channel, authorChannelId, textDisplay, ids.size)
                .then(() => {})
                .catch(err => console.log(err))
            }
          }
        } catch (e) {
          console.log(e);
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

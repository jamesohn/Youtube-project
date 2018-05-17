const collector = require('./collector'),
  deepCopy = require('./deep-copy'),
  stuff = require('./stuff.js'),
  fs = require('fs')
  // date = require('date-utils'),
  // mkdirp = require('mkdirp')

module.exports = class CommentThreads extends collector {
  async collect(channel) {
    let listOption = deepCopy(this.config.requestOpt);
    Object.assign(listOption.qs, {
      allThreadsRelatedToChannelId: channel,
      key: this.config.apiKey
    })

    let idAndCommentText = [];
    await this.searchComment(channel,listOption,idAndCommentText)
    return stuff.uniq(idAndCommentText);
  }

  async searchComment(channel,listOption,idAndCommentText) {
    while (stuff.uniq(idAndCommentText).length < 50000) {
      let body = await this.retryRequest(listOption),
       nextPageToken = body.nextPageToken,
       prevPageToken
      // check response
      if (body === undefined || body.items === undefined || body.items.length < 1){
        console.error('Empty commentThreads')
        break
      } else {
        for (let item of body.items) {
          if (item !== undefined && item.snippet.topLevelComment.snippet !== undefined) {
            let authorChannelId = item.snippet.topLevelComment.snippet.authorChannelId.value
            let textDisplay = item.snippet.topLevelComment.snippet.textDisplay
            idAndCommentText.push({authorChannelId: authorChannelId, textDisplay: textDisplay})
          }
        }
      }
      console.log(stuff.uniq(idAndCommentText).length);
      // change pageToken to nextPageToken
      if (nextPageToken !== undefined) listOption.qs.pageToken = nextPageToken
      if (nextPageToken === prevPageToken || nextPageToken === undefined) break
      prevPageToken = nextPageToken
      // console.log(channel, nextPageToken)
    }
  }

}

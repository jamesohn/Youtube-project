const config = require('config'),
  collector = require('./collector'),
  deepCopy = require('./deep-copy'),
  Stuff = require('./stuff'),
  fs = require('fs'),
  franc = require('franc'),
  Crawler = require('./crawler'),
  Pqueue = require('p-queue'),
  stuff = new Stuff(config)

module.exports = class CommentThreads extends collector {

  async collect(channel) {
    let listOption = deepCopy(this.config.requestOpt),
        crawler = new Crawler(config),
        data

    Object.assign(listOption.qs, {
      allThreadsRelatedToChannelId: channel,
      key: this.config.apiKey
    })

    await this.searchComment(channel,listOption,crawler,data)
    await crawler.onIdle()
    return `${channel} locale done`
  }

  async searchComment(channel,listOption,crawler,data) {

    let ids = new Set(),
        dict = {},
        dict_Ratio = {},
        dict_result = {},
        language = {},
        count = 0

    while(ids.size < 50000) {
      let body = await this.retryRequest(listOption),
       nextPageToken = body.nextPageToken,
       prevPageToken
      // check response
      if(body === undefined || body.items === undefined || body.items.length < 1) {
        if (data === undefined) this.writer(channel,this.reformatter(channel,0,0,{},0))
        break
      }
      for(let item of body.items) {
        try {
          if (item !== undefined && item.snippet.topLevelComment.snippet !== undefined) {
            let authorChannelId = item.snippet.topLevelComment.snippet.authorChannelId.value
            let textDisplay = item.snippet.topLevelComment.snippet.textDisplay

            if(!ids.has(authorChannelId)) {
              ids.add(authorChannelId)
              crawler.concurrencyCollect(authorChannelId, textDisplay)
                .then((result) => {
                  let lang = result.language,
                      locationText = result.locale

                  if(lang.length>0) language[lang] = (language[lang] || 0) + 1;
                  if(dict[lang] == undefined) dict[lang] = {};
                  if(dict_result[lang] == undefined) dict_result[lang] = {};
                  // Make dictionary ex. dict[channelId] = {'eng':{'미국' : 1, '영국' : 2},'kor':{'한국': 10}}
                  if(locationText.length > 0){
                    count += 1
                    dict[lang][locationText] = (dict[lang][locationText] || 0) + 1
                    dict_Ratio = stuff.ratio(dict);
                  }
                  // Allovate identified language proportional to each
                  for(let lang in language){
                    let multiple = language[lang];
                    if(dict_Ratio[lang] != null){
                      for(let country in dict_Ratio[lang]) dict_result[lang][country] = dict_Ratio[lang][country]*multiple; // Estimated number of people
                    }
                  }
                  let copy = deepCopy(dict_result)
                  let final = stuff.final(copy)
                  let cpm = stuff.cpm(final)

                  data = this.reformatter(channel, parseInt(ids.size), parseInt(count), final, parseFloat(cpm))

                  this.writer(channel, data)
                })
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
    }
  }

  reformatter(channel, commentCount, crawledCount, locale, cpm) {
    return {
      id: channel,
      commentCount: commentCount,
      crawledCount: crawledCount,
      locale: locale,
      cpm: cpm
    }
  }

  writer(channel, data) {
    let filen = './' + 'locale_Test/' + channel + '.txt'
    fs.writeFile(filen, JSON.stringify(data), 'utf8', function(err){
      return 'done'
    });
  }

}

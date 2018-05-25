const collector = require('./collector'),
  cheerio = require('cheerio'),
  Pqueue = require('p-queue'),
  franc = require('franc'),
  fs = require('fs'),
  stuff = require('./stuff.js'),
  deepCopy = require('./deep-copy.js')

let dict = {},
    dict_Ratio = {},
    result = {},
    language = {},
    count

module.exports = class Crawler extends collector {

  async parse(url) {
    if(typeof url === 'string') {
      let crawlerOpt = deepCopy(this.config.crawlerOpt);

      Object.assign(crawlerOpt, {
        url: url
      })
      let body = await this.retryRequest(crawlerOpt);
      return body
    }
    else console.log('Url type is not string');
  }

  async loc(url) {
    let body = await this.parse(url);
    let $ = cheerio.load(body);
    // Parse html
    let location = $('.country-inline');
    // Delete white space
    let locationText = location.text().trim()

    return locationText
  }

  async langDetect(text) {
    if(typeof text === 'string') return franc(text, {minLength: 3});
    else console.log('Input text is not string');
  }

  async onIdle() {
    await this.queue.onIdle()
  }

  async delObj(channelId) {
    if(dict.hasOwnProperty(channelId)) {
      delete dict[channelId]
      delete language[channelId]
      delete dict_Ratio[channelId]
      delete result[channelId]
    }
    console.log(dict, language, dict_Ratio, result);
  }

  async collect(channelId, authorchannelId, text, commentCount) {
    let url = `https://www.youtube.com/channel/${authorchannelId}/about`;
    let locationText = await this.loc(url);
    let lang = await this.langDetect(text);

    if(dict[channelId] == undefined) {
      language[channelId] = {},
      dict[channelId] = {},
      dict_Ratio[channelId] = {},
      result[channelId] = {},
      count = 0
    }

    if(lang.length>0){
      language[channelId][lang] = (language[channelId][lang] || 0) + 1;
    }
    if (dict[channelId][lang] == undefined) dict[channelId][lang] = {};
    if (result[channelId][lang] == undefined) result[channelId][lang] = {};

    if (locationText.length > 0){
      count += 1
      // Make dictionary ex. dict[channelId] = {'eng':{'미국' : 1, '영국' : 2},'kor':{'한국': 10}}
      dict[channelId][lang][locationText] = (dict[channelId][lang][locationText] || 0) + 1
    }
    // Allovate identified language proportional to each
    for(let lang in language[channelId]){
      let multiple = language[channelId][lang];
      dict_Ratio[channelId][lang] = stuff.ratio(dict[channelId][lang]); // convert count to percentile
      if(Object.keys(dict_Ratio[channelId][lang]).length !== 0){
        for(let country in dict_Ratio[channelId][lang]){
          result[channelId][lang][country] = dict_Ratio[channelId][lang][country]*multiple; // Estimated number of people
        }
      }
    }
    let copy = deepCopy(result[channelId])
    let final = stuff.merge(copy)
    let final_Ratio = stuff.ratio(final)
    let sorted_final_Ratio = stuff.sortObj(final_Ratio)

    // console.log(sorted_final_Ratio);
    let cpm = stuff.cpm(sorted_final_Ratio)
    // console.log(cpm);
    let filen = './' + 'locale_Test/' + channelId + '_locale.txt'
    fs.writeFile(filen, `totalCommentCount: ${commentCount}, crawledCount: ${count}\n${JSON.stringify(sorted_final_Ratio)}\ncpm: ${cpm} 원`, 'utf8', function(err){
      return 'done'
    });

  }



}

/* This is Youtube demo analytic tool made by Team Picasso, Hyung Jun Sohn.
This reduces deviation with actual data occuring from different response rate by country
The analsis follow 3 steps.
1. Fetch comment information(commentAuthorId & textDisplay)
2. Detect language of comment & Crawl locale from Youtube channel Home
3. Allocate each language counted proportional to crawled locale

Ex. Detected lang = {'eng':100, 'kor':20}, crawled locale = {'eng':{'United States' : 10, 'UK' : 30, 'korea':10},'kor':{'Korea': 10}}
Assume 10% out of 100 English users are from Korea. Then, total estimated viewer from Korea is 100*0.1+10*1 = 20.
Do the same thing for all country and divide each number by total of estimated. */

const request = require('request-promise'),
  cheerio = require('cheerio'),
  Crawler = require('crawler'),
  fs = require('fs'),
  stuff = require('./stuff.js'),
  deepCopy = require('./deep-copy.js')

let dict = {},
    dict_Ratio = {},
    result = {},
    language = {}

module.exports = crawlerOpt = {
  maxConnections : 10,
  retryTimeout: 15000,
  preRequest : function(options, done) {
    let lang = options.language;
    let channelId = options.channel;

    if(dict[channelId] == undefined){
      language[channelId] = {},
      dict[channelId] = {},
      dict_Ratio[channelId] = {},
      result[channelId] = {},
      index = 0
    }

    if(lang.length>0){
      if (language[channelId][lang]) language[channelId][lang]= language[channelId][lang] + 1;
      else language[channelId][lang] = 1;
    }
    if (dict[channelId][lang] == undefined) dict[channelId][lang] = {};

    if (result[channelId][lang] == undefined) result[channelId][lang] = {};

    done();
    },
  // This will be called for each crawled page
  callback : function (error, res, done) {
    if(error) console.log(error);
    else {
      let lang = res.options.language;
      let channelId = res.options.channel

      let body = res.$.xml();
      // $ is Cheerio by default
      let $ = cheerio.load(body);
      // Parse html
      let location = $('.country-inline');
      // Delete white space
      let locationText = location.text().trim();
      if (locationText.length > 0){
        index += 1
        // Make dictionary ex. dict[channelId] = {'eng':{'미국' : 1, '영국' : 2},'kor':{'한국': 10}}
        if (dict[channelId][lang][locationText]) dict[channelId][lang][locationText] = dict[channelId][lang][locationText]+1
        else dict[channelId][lang][locationText] = 1
      }
      // Allovate identified language proportional to each
      for(let lang in language[channelId]){
        let multiple = language[channelId][lang];
        dict_Ratio[channelId][lang] = stuff.ratio(dict[channelId][lang]); // convert count to percentile
        if(Object.keys(dict_Ratio[channelId][lang]).length !== 0){
          for(country in dict_Ratio[channelId][lang]){
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
      fs.writeFile(filen, `totalCommentCount: ${res.options.commentCount}, crawledCount: ${index}\n${JSON.stringify(sorted_final_Ratio)}\ncpm: ${cpm} 원`, 'utf8', function(err){
        return 'done'
      });


  }
  done();
}
}

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
  Math = require('math'),
  stuff = require('./stuff.js'),
  Pqueue = require('p-queue'),
  pqueuecrawler = new Pqueue ({ concurrency:1000 }),
  franc = require('franc')

  var dict = {},
      dict_Ratio = {},
      result = {},
      language = {}

module.exports = {
  collect : function(channelId, authorChannelId_text){
    language[channelId] = {},
    dict[channelId] = {},
    dict_Ratio[channelId] = {},
    result[channelId] = {}

    const len_list = authorChannelId_text.length


    var c = new Crawler({
    maxConnections : 100,
    retryTimeout: 15000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        } else {
            let lang = res.options.lang;
            var body = res.$.xml();
            // $ is Cheerio by default
            var $ = cheerio.load(body);
            // Parse html
            var location = $('.country-inline');
            // Delete white space
            var locationText = location.text().trim();
            if (locationText.length > 0){
              // Make dictionary ex. dict[channelId] = {'eng':{'미국' : 1, '영국' : 2},'kor':{'한국': 10}}
              if (dict[channelId][lang][locationText]){
                dict[channelId][lang][locationText]= dict[channelId][lang][locationText]+1
              } else {
                dict[channelId][lang][locationText] = 1
              }
            }
            console.log(res.options.index);
            console.log(res.options.maxIndex);
            if(res.options.index + 1 == res.options.maxIndex){
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

              let final = stuff.merge(result[channelId]) // Merge has to be exectuted only once, at the end.
              let final_Ratio = stuff.ratio(final)
              let sorted_final_Ratio = stuff.sortObj(final_Ratio)

              console.log(sorted_final_Ratio);
              let cpm = stuff.cpm(sorted_final_Ratio)
              console.log(cpm);
              var filen = './' + 'locale/' + channelId + '_locale.txt'
              fs.writeFile(filen, JSON.stringify(sorted_final_Ratio)+'/n cpm: '+cpm+' 원', 'utf8', function(err){
                console.log('done');
                return 'done'
              });
            }

        }
        done();
    }
    });

    var index = -1;

    for(each of authorChannelId_text){
      var authorChannelId = each.authorChannelId,
          text = each.textDisplay,
          langDetected = franc(text, {minLength: 3});

      if(langDetected.length>0){
        if (language[channelId][langDetected]){
          language[channelId][langDetected]= language[channelId][langDetected] + 1;
        } else {
          language[channelId][langDetected] = 1;
        }
      }
      if (dict[channelId][langDetected] == undefined){
        dict[channelId][langDetected] = {};
      }
      if (result[channelId][langDetected] == undefined){
        result[channelId][langDetected] = {};
      }
      if (authorChannelId.length>0){
        index += 1;
        var url = 'https://www.youtube.com/channel/' + authorChannelId + '/about'
        c.queue({
          lang: langDetected,
          uri: url,
          index: index,
          maxIndex: len_list
        });
      }

    }

    }
  }

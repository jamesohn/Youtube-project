const request = require('request-promise'),
  cheerio = require('cheerio'),
  Crawler = require('crawler'),
  fs = require('fs'),
  Math = require('math'),
  stuff = require('./stuff.js')


  // stuff = require('stuff.js')

// stuff = require('stuff.js')

  var dict = {},
    dict_Ratio = {}

module.exports = {
  crawler : function(channelId, authorChannelId_list){
    dict[channelId] = {},
    dict_Ratio[channelId] = {}
    const len_list = authorChannelId_list.length
    var c = new Crawler({
    maxConnections : 100,
    retryTimeout: 100,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        } else {
            var body = res.$.xml();
            // $ is Cheerio by default
            var $ = cheerio.load(body);
            // Parse html
            var location = $('.country-inline');
            // Delete white space
            var locationText = location.text().trim();
            if (locationText.length > 0){
              // Make dictionary ex. dict[channelId] = {'미국' : 1, '영국' : 2}
              if (dict[channelId][locationText]){
                dict[channelId][locationText]= dict[channelId][locationText]+1
              } else {
                dict[channelId][locationText] = 1
              }
            }
            // Create array of values in dict[channelId]
            var values = Object.keys(dict[channelId]).map(function(key){
              return dict[channelId][key];
              });
            // Sum values in dict[channelId] with anonymous function
            var total = values.reduce(function(a,b){return a+b},0);
            // Fill in dict_Ratio[channelId] and return
            var ratio = Object.keys(dict[channelId]).map(function(key){
              return dict_Ratio[channelId][key] = Math.floor(((dict[channelId][key]/total)*10000))/100
              });
            // Create instant array to sort dict_Ratio[channelId] by value
            var sortable = []
            for (country in dict_Ratio[channelId]) {
              sortable.push([country, dict_Ratio[channelId][country]])
              }
            // Sort the array
            sortable.sort(function(a,b){return b[1]-a[1]})
            // Convert array to obj
            var sorted_obj = sortable.reduce(function(acc, cur, i) {
              acc[cur[0]] = cur[1];
              return acc;
              }, {});

            // console.log(channelId+': '+total, sortable.slice(0,10));
            // console.log(channelId+'\n'+res.options.index);
            // console.log(res.options.maxIndex);
            if(res.options.index + 1 == res.options.maxIndex){
              let cpm = stuff.cpm(sorted_obj)
              console.log(cpm);
              var filen = './' + 'channelDetail/' + channelId + 'New_locale.txt'
              fs.writeFile(filen, total+' '+JSON.stringify(sorted_obj)+'/n cpm: '+cpm+' 원', 'utf8', function(err){
                console.log('done');
                return 'done'
              });
            }

        }
        done();
    }
    });

    var maxCount = 0;
    // iterate authorChannelId_list for url creation
    for (j=0; j<len_list; j++) {
      var authorChannelId = authorChannelId_list[j];
      if (authorChannelId.length>0){
        maxCount += 1;
      }
    }
    var index = -1;
    for (j=0; j<len_list; j++){
      var authorChannelId = authorChannelId_list.shift();
      // console.log(authorChannelId_list.length);
      if (authorChannelId.length>0){
        index += 1;
        var url = 'https://www.youtube.com/channel/' + authorChannelId + '/about'
        c.queue({
          uri: url,
          index: index,
          maxIndex: maxCount
        });
      }
    }
    }

  }

/* load modules */
// process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js'),
  videoList = require('./lib/video-list.js'),
  videoDetail = require('./lib/video-detail.js'),
  authorChannelId = require('./lib/youtube_authorChannelId_node.js'),
  crawler = require('./lib/crawler0.js'),
  stuff = require('./lib/stuff.js')
// 1M dance studio,보겸, j.fla,대도서관, 벤쯔, 씬님, 테크리드,조마테크,포프tv,과학쿠키
// 'UCw8ZhLPdQ0u_Y-TLKd61hGA','UCu9BCtGIEr73LXZsKmoujKw','UClkRzsdvg7_RKVhwDwiDZOA','UCSHVH_AWVUc-C8-D8mh8W6A','UCYx9lhCw0u2-OoqVtEU0IMg','UC5xK2Xdrud3-KGjkS1Igumg','UC4xKdmAXFh4ACyhpiQ_3qBw','UCV0qA-eDDICsRR9rPcnG7tw', 'UC63J0Q5huHSlbNT3KxvAaHQ', 'UCmgRYMK5d65PbjN8qkjAUBA'
/* load channel-list from csv*/
var channel_raw = ['UC5xK2Xdrud3-KGjkS1Igumg'],
  channel_list = [],
  videocomment = {},
  commentAuthorChannelId_list = {}

for(var channel of channel_raw){
  videocomment[channel] = []
  commentAuthorChannelId_list[channel] = []
  channel_list.push(channel)
  if(channel_list.length >= 10) // option(have to erase on product)
     break
}

/* fetch jobs on main */
const main = async (channel) => {
  try {
    console.log('this is ' + channel)
    let videoCount = await channelDetail(channel)
    if(videoCount === Error) throw new Error('invalid channel')
    else if(videoCount === '0' || videoCount === 0) return 0
    else console.log('Channel Detail ' + channel + ' done')

    let { dir_name, video_list } = await videoList(channel, videoCount)
    console.log('Video List ' + channel + ' done')

    for(const videoId of video_list){
      videocomment[channel].push({ videoId: videoId, commentCount: await videoDetail(dir_name, videoId) })
      console.log(channel+' videocomment ' + videoId + ' done');
    } // Makeing obj at index is faster than making and returning it from videoDetail
    i=0;
    for(const obj of videocomment[channel]){
      commentAuthorChannelId_list[channel] = commentAuthorChannelId_list[channel].concat(await authorChannelId(channel, obj.videoId, obj.commentCount));
      console.log(channel+': '+commentAuthorChannelId_list[channel].length);

      if(commentAuthorChannelId_list[channel].length>100000){
        let result = stuff.uniq(commentAuthorChannelId_list[channel]);
        console.log(channel+': '+result.length+' sample comments');
        crawler.crawler(channel,result)
        delete commentAuthorChannelId_list[channel]
        return 'done'
      }
    }
    let result1 = stuff.uniq(commentAuthorChannelId_list[channel])
    console.log(channel+': '+result1.length+' sample comments');
    crawler.crawler(channel,result1)
    delete commentAuthorChannelId_list[channel]
  } catch (error){
    console.log(error)
  }
}

/* run queue & save data */
var tasks = {}
for(const channel of channel_list){
  console.log(channel)
  tasks["channelInfo" + channel] = main(channel)
}

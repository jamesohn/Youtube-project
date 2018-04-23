/* load modules */
// process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js'),
  videoList = require('./lib/video-list.js'),
  videoDetail = require('./lib/video-detail.js'),
  authorChannelId = require('./lib/youtube_authorChannelId_node.js'),
  crawler = require('./lib/crawler0.js')

// 'UC5xK2Xdrud3-KGjkS1Igumg','UC4xKdmAXFh4ACyhpiQ_3qBw','UCV0qA-eDDICsRR9rPcnG7tw'
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
      videocomment[channel].push(await videoDetail(dir_name, videoId))
      console.log(channel+' videocomment ' + videoId + ' done');
    }
    i=0;
    for(const obj of videocomment[channel]){
      console.log(i+' '+await authorChannelId(channel, obj.videoId, obj.commentCount));
      // commentAuthorChannelId_list[channel] = commentAuthorChannelId_list[channel].concat(await authorChannelId(channel, obj.videoId, obj.commentCount))
      // commentAuthorChannelId_list = await authorChannelId(channel, obj.videoId, obj.commentCount)
      i++
      // console.log(i+' '+channel +' '+ commentAuthorChannelId_list[channel].length);
      if(commentAuthorChannelId_list[channel].length>200000){
        console.log('comment over 200,000');
        crawler.crawler(channel,commentAuthorChannelId_list[channel])
        delete commentAuthorChannelId_list[channel]
        break
      }
    }
    crawler.crawler(channel,commentAuthorChannelId_list[channel])
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

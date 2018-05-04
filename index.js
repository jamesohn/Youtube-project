/* load modules */
// process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const config = require('config'),
  fs = require('fs'),
  channelDetail = require('./lib/channel-detail.js'),
  videoList = require('./lib/video-list.js'),
  videoDetail = require('./lib/video-detail.js'),
  authorChannelId = require('./lib/youtube_authorChannelId_node.js'),
  crawler = require('./lib/crawler0.js'),
  stuff = require('./lib/stuff.js'),
  img = require('./face_recog/visualize.js')
// '슈기님','아리키친','창현거리노래방','스팀보이','양띵의사생활','철구형','크림히어로즈','말이야와아이들','윤쨔미',윰댕,소프,Evan Michael,1M dance studio,보겸, j.fla,대도서관, 벤쯔, 씬님, 테크리드,조마테크,포프tv,과학쿠키
// 'UCBCY00Ox6Cins0oRwSLqNGA','UC2jkfOUD5KNbIpkb77-chqQ','UCPJmHR4CG_lRuVwKCo0kjjg','UCTA-2mGsWmVYqZHBvvM9Vmg','UCHcDLOhRi_WkDJ3zOM3FehQ','UCUY0FVprY69TQu5pbho2PNw','UCmLiSrat4HW2k07ahKEJo4w','UCQtPAu0FjPbA1ku3cA5R2mg','UCoDLLyiqum2JOBI4Dty8eUA','UCRiGI5nRBYZjGZ0OuGBtqHA','UCKmkpoEqg1sOMGEiIysP8Tw','UCw8ZhLPdQ0u_Y-TLKd61hGA','UCu9BCtGIEr73LXZsKmoujKw','UClkRzsdvg7_RKVhwDwiDZOA','UCSHVH_AWVUc-C8-D8mh8W6A','UCYx9lhCw0u2-OoqVtEU0IMg','UC5xK2Xdrud3-KGjkS1Igumg','UC4xKdmAXFh4ACyhpiQ_3qBw','UCV0qA-eDDICsRR9rPcnG7tw', 'UC63J0Q5huHSlbNT3KxvAaHQ', 'UCmgRYMK5d65PbjN8qkjAUBA'
// 'https://www.youtube.com/channel/UCid83oPnsL-4ZEo8CyQr6Rg',
// // 'https://www.youtube.com/user/miiiiiiim1',
// 'https://www.youtube.com/channel/UCdet8uJfTFlACtY05BQmJ1Q',
// 'https://www.youtube.com/channel/UCkzI8yaQ6q2aDKS70EzJCLw',
// // 'https://www.youtube.com/user/realcuckoocrew',
// 'https://www.youtube.com/channel/UCw7ej35vkwxRMWvH8DeoCNQ',
// 'https://www.youtube.com/channel/UCkTou95-Hb_GJ6IG5MxuyDA',
// // 'https://www.youtube.com/user/mrpanda101/videos',
// 'https://www.youtube.com/channel/UCAAyQrLDrcK0h1Ll3g8lURw',
// // 'https://www.youtube.com/user/royjotv',
// // 'https://www.youtube.com/user/eowjdfudshrghk',
// // 'https://www.youtube.com/user/J1HminiWorld',
// 'https://www.youtube.com/channel/UCfTswP_uNy_h86pUjCU410A',
// 'https://www.youtube.com/channel/UChbE5OZQ6dRHECsX0tEPEZQ',
// 'https://www.youtube.com/channel/UC6XZ4fmiUPQk6ws6fGs2rQg',
// // 'https://www.youtube.com/user/nutellavoice',
// 'https://www.youtube.com/channel/UCicKQUi8h4NI81wDmrDBD4A',
// 'https://www.youtube.com/channel/UCjwARif8DDcHno_X1aLbnFA',
// 'https://www.youtube.com/channel/UCoUDrzyCl1IwU602xdTsM-g',
// 'https://www.youtube.com/channel/UCj7mdvAJCRKvGBmcusOr9Ag',
// // 'https://www.youtube.com/user/gogient',
// 'https://www.youtube.com/channel/UC9JlObZnbOirT4_iyPGrdcw',
// 'https://www.youtube.com/channel/UCsU2RlGgybcLzfmBqnTx-Rw',
// 'https://www.youtube.com/channel/UCu6mog947IWOXL23AzKlImw',
// 'https://www.youtube.com/channel/UCAUbDYDwV34yk6pYiZg_CzA',
// // 'https://www.youtube.com/user/3castle1',
// 'https://www.youtube.com/channel/UCf9sl-IcwNXDqWwWwp4vEwg',
// 'https://www.youtube.com/channel/UCZTavrg2A43lQMWxiK3yu7g',
// 'https://www.youtube.com/channel/UCOgGAfSUy5LvEyVS_LF5kdw',
// 'https://www.youtube.com/channel/UCUbOogiD-4PKDqaJfSOTC0g',
// // 'https://www.youtube.com/user/moncastwebdong',
// 'https://www.youtube.com/channel/UCta_NRwnsUaew0t3VNxBNyg',
// // 'https://www.youtube.com/user/VIDEOVILLAGEkr',
// 'https://www.youtube.com/channel/UC2o_y872S6YvaO1K8EYnoxg',
// // 'https://www.youtube.com/user/Doorong1',
// // 'https://www.youtube.com/user/ULSANBIGWHALE',
// // 'https://www.youtube.com/user/gkook1',
// 'https://www.youtube.com/channel/UCTCYh96Ex4lRWMRg0YQvlIQ',
// 'https://www.youtube.com/channel/UC8kRUGUkq_sTGuKNR1l6Rrw',
// 'https://www.youtube.com/channel/UC0y5-iH3ejU0qZjgHvH7A7w',
// 'https://www.youtube.com/channel/UCAbd8xHBGObktNG6F4GeChA'
// // 'https://www.youtube.com/user/sleepshin',
// // 'https://www.youtube.com/user/GIRI4193'
/* load channel-list from csv*/
// UCV0qA-eDDICsRR9rPcnG7tw
// UC4xKdmAXFh4ACyhpiQ_3qBw
var channel_raw = ['UCfuyBWU_JLXvf5TMM-IGvrA','UCKmkpoEqg1sOMGEiIysP8Tw'],
  channel_list = [],
  videocomment = {},
  commentAuthorChannelId_list = {}

for(var channel of channel_raw){
  // channel = channelUrl.split('/')[4];
  // console.log(channel.split('/')[4]);
  videocomment[channel] = []
  commentAuthorChannelId_list[channel] = []
  channel_list.push(channel)
  // if(channel_list.length >= 10) // option(have to erase on product)
  //    break
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
      console.log(commentAuthorChannelId_list[channel]);
      console.log(channel+': '+commentAuthorChannelId_list[channel].length);

      if(stuff.uniq(commentAuthorChannelId_list[channel]).length>50000){
        let result = stuff.uniq(commentAuthorChannelId_list[channel]);
        console.log(channel+': '+result.length+' sample comments');
        crawler.crawler(channel,result)
        delete commentAuthorChannelId_list[channel]
        return 'done'
      }
    }
    let result1 = stuff.uniq(commentAuthorChannelId_list[channel])
    console.log(channel+': '+result1.length+' sample comments');
    // img.visualize(channel,result1)
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

// Getting video_detail_info by each videos on YouTube Channel using Youtube Data API v3

const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry')

module.exports = async (dir_name, videoId, config = require('config')) => {
  const { api_key, base_url, retryOpt, requestOpt, saveData } = config.videoDetail
  const url = base_url + '&key=' + api_key + '&id=' + videoId
  // var newDate = new Date()
  // var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z')
  const file_name = dir_name + videoId + '_videoDetail' + '.txt'

  const retryRequest = async option => await retry(async () => {
    const res = await request(option)
    if (typeof res !== 'object' && res.length < 1) new Error('bad response')
    return res
  }, retryOpt)

  let videoOption = Object.assign({
    transform: (body, res) => {
      if (res.statusCode === 204) return { total: 0 }
      return body
    },
  }, requestOpt)

  videoOption.url = url

  let body = await retryRequest(videoOption)

  if (body !== undefined){
    if (body.items !== undefined){
      var file = await fs.createWriteStream(file_name)
      await saveData(
        file,
        videoId,
        body.items[0].snippet.title,
        'http://youtube.com/watch?v=' + videoId,
        body.items[0].snippet.thumbnails.high.url,
        body.items[0].snippet.categoryId,
        body.items[0].statistics.viewCount,
        body.items[0].statistics.likeCount,
        body.items[0].statistics.dislikeCount,
        body.items[0].statistics.commentCount,
        body.items[0].snippet.publishedAt
        // time
      )
      file.end();
      return body.items[0].statistics.commentCount
    }
    return Error('invalid video error')
  }
  return Error('video request error')
}

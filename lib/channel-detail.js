const request = require('request-promise'),
  fs = require('fs'),
  date = require('date-utils'),
  retry = require('async-retry')

module.exports = async (channel, config = require('config')) => {
  const { api_key, base_url, retryOpt, requestOpt, saveData } = config.channelDetail
  // var newDate = new Date()
  // var time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z')
  const url = base_url + '&key=' + api_key + '&id=' + channel
  const dir_name = './' + 'channelDetail/'
  const file_name = dir_name + channel + '_channeldetail' + '.txt'


  const retryRequest = async option => await retry(async () => {
    const res = await request(option)
    if (typeof res !== 'object' && res.length < 1) new Error('bad response')
    return res
  }, retryOpt)

  let channelOption = Object.assign({
    transform: (body, res) => {
      if (res.statusCode === 204) return { total: 0 }
      return body
    },
  }, requestOpt)

  channelOption.url = url

  let body = await retryRequest(channelOption)

  if (body !== undefined){
    if (body.items[0].statistics.videoCount !== '0'){
      var file = await fs.createWriteStream(file_name)
      await saveData(
        file,
        channel,
        body.items[0].snippet.title,
        'http://www.youtube.com/channel/' + channel,
        body.items[0].snippet.thumbnails.high.url,
        body.items[0].statistics.viewCount,
        body.items[0].statistics.subscriberCount,
        body.items[0].statistics.videoCount,
        body.items[0].snippet.publishedAt
        // time
      )
      file.end()
      return body.items[0].statistics.videoCount
    }
    return 0
  }
  return Error('invalid channel error')
}

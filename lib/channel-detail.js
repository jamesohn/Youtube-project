const Collector = require('./collector.js'),
  deepCopy = require('./deep-copy.js')


module.exports = class channelDetail extends Collector {

  reformatter(body) {
    const item = body.items[0]

    return {
      id: item.id,
      name: item.snippet.title,
      url: `http://www.youtube.com/channel/${item.id}`,
      thumbnails: [item.snippet.thumbnails.high.url],
      viewCount: item.statistics.viewCount,
      subscriberCount: item.statistics.subscriberCount,
      videoCount: item.statistics.videoCount,
      publishedAt: item.snippet.publishedAt,
      // crawledAt: time,
    }
  }

  async collect(channel) {
    let channelDetailOption = deepCopy(this.config.requestOpt)
    Object.assign(channelDetailOption.qs, {
      key: this.config.apiKey,
      id: channel,
    })

    // request & error check
    let body = await this.retryRequest(channelDetailOption)
    if (body.items[0].statistics.videoCount === '0') return 0

    // reformat response & call write function
    const result = this.reformatter(body)
    await this.writer(result, channel)

    return result.videoCount

  }

}





async (channel, config = require('config')) => {
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

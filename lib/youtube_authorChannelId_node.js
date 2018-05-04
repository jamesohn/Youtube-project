const request = require('request-promise'),
  retry = require('async-retry'),
  fs = require('fs')
  // date = require('date-utils'),
  // mkdirp = require('mkdirp')

module.exports = async (channel, video, videoCommentCount, config = require('config')) => {
  /* init variables */
  const { api_key, base_url, retryOpt, requestOpt } = config.authorChannelId,
    init_url = base_url + '&key=' + api_key + '&videoId=' + video;
  var url = init_url,
    // newDate = new Date(),
    // time = newDate.toFormat('YYYY-MM-DDTHH24:MI:SS.000Z'),
    mid_url = init_url
  var nextPageToken, prevPageToken, publishedAt
  const pageList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const loop_count = Math.ceil(videoCommentCount / 1000)
  if (videoCommentCount === 0 || videoCommentCount === '0'){
    return Error('empty videoCommentCount error')
  }

  var authorChannelId_list = []

  const retryRequest = async option => await retry(async () => {
    const res = await request(option)
    if (typeof res !== 'object' && res.length < 1) new Error('bad response')
    return res
  }, retryOpt)

  let listOption = Object.assign({
    transform: (body, res) => {
      if (res.statusCode === 204) return { total: 0 }
      return body
    },
  }, requestOpt)

  /* search for maximum api by api */
  async function search1000(){
    for (const page of pageList){
      listOption.url = url
      let body = await retryRequest(listOption)

      if (body !== undefined && body.items !== undefined){
        for (const item of body.items){
          if (item !== undefined && item.snippet.topLevelComment.snippet.authorChannelId !== undefined && item.snippet.topLevelComment.snippet.textDisplay !== undefined){
            authorChannelId_list.push({author: item.snippet.topLevelComment.snippet.authorChannelId.value, text:item.snippet.topLevelComment.snippet.textDisplay})
            // console.log('commentAuthorId ' + item.snippet.topLevelComment.snippet.authorChannelId.value + ' fetched')
          }
          nextPageToken = await body.nextPageToken
          publishedAt = await item.snippet.publishedAt
        }
        if (nextPageToken !== 'endPage' && nextPageToken !== undefined)
          url = await mid_url + '&pageToken=' + nextPageToken
        if (nextPageToken === prevPageToken)
          return 'done'
        prevPageToken = nextPageToken
      }

      else {
        if (page < 9) break
        else return Error('video result page error')
      }
    }

    mid_url = await init_url + '&publishedBefore=' + publishedAt
    url = mid_url
    nextPageToken = 'endPage'

  }

  for(var i = 0; i < loop_count; i ++){
    const r = await search1000()
  }

  return authorChannelId_list
}

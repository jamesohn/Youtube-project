// api_key = AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE
// api_key = AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo
// api_key = AIzaSyCVW1-bw1zkX4NQMLe8NxP-6wpw1mUSraU
module.exports = {
  authorChannelId: {
    api_key: 'AIzaSyCVW1-bw1zkX4NQMLe8NxP-6wpw1mUSraU',
    base_url: 'https://www.googleapis.com/youtube/v3/commentThreads?textFormat=plainText&part=snippet&maxResults=100',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: '',
      json: true,
    }
  },
  channelDetail: {
    api_key: 'AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE',
    base_url: 'https://www.googleapis.com/youtube/v3/channels?part=id,snippet,statistics',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: '',
      json: true,
    },
    saveData: async function saveData(file, channelId, channelTitle, channelUrl, channelThumbnails, channelViewCount, channelSubscriberCount, channelVideoCount, channelPublishedAt, channelCrawledAt){
      await file.write('{\nchannel_id: ' + channelId + ',\n')
      await file.write('channel_name: ' + channelTitle + ',\n')
      await file.write('channel_url: ' + channelUrl + ',\n')  // get url
      await file.write('channel_thumbnails: ' + channelThumbnails + ',\n')  // can choose default(88), medium(240), high(800)
      await file.write('channel_viewCount: ' + channelViewCount + ',\n')
      await file.write('channel_subscriberCount: ' + channelSubscriberCount + ',\n')
      await file.write('channel_videoCount: ' + channelVideoCount + ',\n')
      await file.write('channel_publishedAt: ' + channelPublishedAt + ',\n')
      await file.write('channel_crawledAt: ' + channelCrawledAt + '\n}')
    },
  },
  videoList: {
    api_key: 'AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE',
    base_url: 'https://www.googleapis.com/youtube/v3/search?part=id,snippet&type=video&order=date&maxResults=50',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: '',
      json: true,
    },
  },
  videoDetail: {
    api_key: 'AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo',
    base_url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics',
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
    requestOpt: {
      url: '',
      json: true,
    },
    saveData: async function saveData(file, videoId, videoTitle, videoUrl, videoThumbnails, videoCategory, videoViewCount, videoLikeCount, videoDislikeCount, videoCommentCount, videoPublishedAt, videoCrawledAt){
      await file.write('{\nvideo_id: ' + videoId + ',\n')
      await file.write('video_name: ' + videoTitle + ',\n')
      await file.write('video_url: ' + videoUrl + ',\n')  // get url
      await file.write('video_thumbnails: ' + videoThumbnails + ',\n')  // can choose default(88), medium(240), high(800)
      await file.write('video_category: ' + videoCategory + ',\n')
      await file.write('video_viewCount: ' + videoViewCount + ',\n')
      await file.write('video_likeCount: ' + videoLikeCount + ',\n')
      await file.write('video_dislikeCount: ' + videoDislikeCount + ',\n')
      await file.write('video_commentCount: ' + videoCommentCount + ',\n')
      await file.write('video_publishedAt: ' + videoPublishedAt + ',\n')
      await file.write('video_crawledAt: ' + videoCrawledAt + '\n}')
    },
  }
}

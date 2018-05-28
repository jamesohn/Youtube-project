module.exports = {
  api_key: '',
  retryOpt: {
    retries: 5,
    minTimeout: 1000,
    maxTimeout: 15000,
  },
  crawlerOpt: {
    json: true,
  },
  commentThreads: {
    requestOpt: {
      url: 'https://www.googleapis.com/youtube/v3/commentThreads',
      qs: {
        textFormat: 'plainText',
        part : 'snippet',
        maxResults: 100,
      },
      json: true,
    },
  }
}

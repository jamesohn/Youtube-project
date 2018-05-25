// api_key = AIzaSyD4OiN3CC8FtDujdkyDsOCBQJdrOTyoeDE
// api_key = AIzaSyCZyVxgyR6x6AFDd3BOjoIr0H-vyWrGygo
// api_key = AIzaSyCVW1-bw1zkX4NQMLe8NxP-6wpw1mUSraU
module.exports = {
  api_key: '',
  crawlerOpt: {
    json: true,
  },
  commentThreads: {
    retryOpt: {
      retries: 5,
      minTimeout: 1000,
      maxTimeout: 15000,
    },
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

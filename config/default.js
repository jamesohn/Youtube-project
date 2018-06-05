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
    parquet: {
      schema: {
        id: { type: 'UTF8' },
        commentCount: { type: 'INT64' },
        crawledCount: { type: 'INT64' },
        locale: { type: 'object' },
        cpm: { type: 'FLOAT64' },
      },
      option: {
        useDataPageV2: true,
      },
    },
    s3: {
      bucket: '',
    },
    dynamodb: {
      tableName: '',
      ttl: 30 * 24 * 60 * 60,
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

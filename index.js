/* load modules */
const config = require('config'),
  fs = require('fs'),
  AuthorChannelId = require('./lib/youtube_authorChannelId_node.js'),
  authorChannelId = new AuthorChannelId(config.commentThreads),
  crawler = require('./lib/crawler0.js'),
  stuff = require('./lib/stuff.js'),
  promisify = require('util').promisify,
  cluster = require('cluster'),
  Pqueue = require('p-queue'),
  pqueueAuthorChannelId = new Pqueue({ concurrency: 1000 }),
  pqueuecrawler = new Pqueue ({ concurrency:1000 }),
  numCPUs = require('os').cpus().length,
  mkdirp = promisify(require('mkdirp'))

let channelRaw = ['UCV0qA-eDDICsRR9rPcnG7tw'];
let channelList = [];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  for (let channel of channelRaw) {
    channelList.push(channel)
  }
}
const main = async (channelList) => {
  for (let channel of channelList){
    try {
      console.log('this is ' + channel);
      pqueueAuthorChannelId.add(() => authorChannelId.collect(channel))
      .then(function(result) {
        pqueuecrawler.add(() => crawler.collect(channel, result))
      })
    } catch (e) {
      console.log(e);
    }
  }
}
main(channelList)

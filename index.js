/* load modules */
const config = require('config'),
  fs = require('fs'),
  AuthorChannelId = require('./lib/authorChannelId.js'),
  authorChannelId = new AuthorChannelId(config.commentThreads),
  stuff = require('./lib/stuff.js'),
  promisify = require('util').promisify,
  cluster = require('cluster'),
  Pqueue = require('p-queue'),
  pqueueAuthorChannelId = new Pqueue({ concurrency: 1000 }),
  pqueuecrawler = new Pqueue ({ concurrency:1000 }),
  numCPUs = require('os').cpus().length,
  mkdirp = promisify(require('mkdirp'))

let channelRaw = fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
// ['UC4xKdmAXFh4ACyhpiQ_3qBw']fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
  channelList = [];

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  for (let channel of channelRaw) {
    channelList.push(channel)
    // channelList.push(channel.substring(31))
  }
}
const main = async (channelList) => {
  for (let channel of channelList){
    try {
      console.log('this is ' + channel);
      pqueueAuthorChannelId.add(() => authorChannelId.collect(channel))
      .then(function(result) {
        console.log(result);
      })
    } catch (e) {
      console.log(e);
    }
  }
}
main(channelList)

/* load modules */
const config = require('config'),
  fs = require('fs'),
  AuthorChannelId = require('./lib/authorChannelId.js'),
  authorChannelId = new AuthorChannelId(config.commentThreads),
  stuff = require('./lib/stuff.js'),
  promisify = require('util').promisify,
  cluster = require('cluster'),
  Pqueue = require('p-queue'),
  pqueueAuthorChannelId = new Pqueue({ concurrency: 1 }),
  numCPUs = require('os').cpus().length,
  mkdirp = promisify(require('mkdirp'))

cluster.schedulingPolicy = cluster.SCHED_RR;

if(cluster.isMaster) {

  let channelRaw = fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
  // ['UC4xKdmAXFh4ACyhpiQ_3qBw']fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
    channelList = ['UCV0qA-eDDICsRR9rPcnG7tw','UC4xKdmAXFh4ACyhpiQ_3qBw'];
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    for (let channel of channelRaw) {
      // channelList.push(channel)
      channelList.push(channel.substring(31))
    }
  }
  // Keep track of http requests
  let numReqs = 0;
  setInterval(() => {
    console.log(`${numReqs} done`);
  }, 1000);

  // Count requests
  function messageHandler(msg) {
    if (typeof msg === 'string') {
      numReqs += 1;
      console.log(msg);
    }
  }
  for(let i = 0; i < numCPUs; i++) {
    let worker = cluster.fork();
    if(channelList.length > 0){
      let channel = channelList.shift()
      worker.send(channel)
    }
  }
  for(const id in cluster.workers) {
    cluster.workers[id].on('message', function(message){
      messageHandler(message)
      if(channelList.length > 0){
        let channel = channelList.shift()
        cluster.workers[id].send(channel)
      }
    })
  }
}

if(cluster.isWorker) {
  process.on('message', (message) => {
    try {
      console.log(`${cluster.worker.id} starts ` + message);
      pqueueAuthorChannelId.add(() => authorChannelId.collect(message))
      .then(function(result) {
        console.log(result);
        process.send(result)
      })
    } catch (e) {
      console.log(e);
    }
  })
}

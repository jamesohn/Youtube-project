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
  // This is done
  const dirPath = './locale_Test2';
  const previous = fs.readdirSync(dirPath,'utf8');

  function removeDone(channelList,previous) {
    let set = new Set(),
      feed = []

    if ((typeof channelList === 'object' && typeof previous === 'object')) {
      for(let channel of previous) set.add(channel)
      for(let channel of channelList) {
        if(!set.has(channel)) feed.push(channel)
      }
      console.log(set.size);
      return feed
    }
    else {
      console.log('Func removeDone Input type error');
    }
  }
  // Skip previously done channels
  function fromLastChannel() {
    let channelRaw = fs.readFileSync('./filtered.csv', 'utf8').split(/\r?\n/),
      channelList = [];
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      for (let channel of channelRaw) {
        channelList.push(channel.substring(31))
      }
    }
    let feed = removeDone(channelList,previous)

    for(let filen of previous) {
      let content = fs.readFileSync(`${dirPath}/${filen}`, 'utf8')
      if(content === '') feed.unshift(filen.split('.')[0])
    }

    return feed
  }
  // Make new channelList
  let feed = fromLastChannel();

  // Keep track worker and finished channel
  let numReqs = 0;
  let totalDone = previous.length + numReqs
  let workerNum = 4;
  setInterval(() => {
    console.log(`Done: ${numReqs}, Total: ${totalDone} done\nWorking: ${workerNum}`);
  }, 1000);
  // Count requests
  function messageHandler(msg) {
    if (typeof msg === 'string') {
      numReqs += 1;
      console.log(msg);
    }
  }
  // Fork workers
  for(let i = 0; i < numCPUs; i++) {
    let worker = cluster.fork();
    if(feed.length > 0){
      let channel = feed.shift()
      worker.send(channel)
    }
  }
  // When a worker finishes work, distribute new work
  for(const id in cluster.workers) {
    cluster.workers[id].on('message', function(message){
      messageHandler(message)
      if(feed.length > 0){
        let channel = feed.shift()
        cluster.workers[id].send(channel)
      }
    })
  }
  // Notifi when worker died
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    worker -= 1;
  });
}
// Recieve task and send message back to master if work is done
if(cluster.isWorker) {
  process.on('message', (message) => {
    try {
      console.log(`${cluster.worker.id} starts ` + message);
      pqueueAuthorChannelId.add(() => authorChannelId.collect(message))
      .then(function(result) {

        process.send(result)
      })
    } catch (e) {
      console.log(e);
    }
  })
}

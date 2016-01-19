import debugLib from 'debug';
const debug = debugLib('app:example');

// REQUIRE THE PACKAGE //

// var NR = require(__dirname + '/../index.js');
const NR = require('node-resque');

// SET UP THE CONNECTION //

const connectionDetails = {
  pkg: 'ioredis',
  host: '127.0.0.1',
  password: null,
  port: 6379,
  database: 0
  // namespace: 'resque',
  // looping: true,
  // options: {password: 'abc'},
};

// DEFINE YOUR WORKER TASKS //

let jobsToComplete = 0;
const jobs = {
  add: {
    plugins: [ 'jobLock' ],
    pluginOptions: {
      jobLock: {}
    },
    perform: (a, b, callback) => {
      setTimeout(() => {
        jobsToComplete--;
        shutdown();

        const answer = a + b;
        callback(null, answer);
      }, 1000);
    }
  },
  subtract: {
    perform: (a, b, callback) => {
      jobsToComplete--;
      shutdown();

      const answer = a - b;
      callback(null, answer);
    }
  }
};

// START A WORKER //

const worker = new NR.worker({connection: connectionDetails, queues: ['math', 'otherQueue']}, jobs);
worker.connect(() => {
  worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
  worker.start();
});

// START A SCHEDULER //

const scheduler = new NR.scheduler({connection: connectionDetails});
scheduler.connect(() => {
  scheduler.start();
});

// REGESTER FOR EVENTS //

worker.on('start', () => { debug('worker started'); });
worker.on('end', () => { debug('worker ended'); });
worker.on('cleaning_worker', (worker, pid) => { debug(`cleaning old worker ${worker}`); });
worker.on('poll', (queue) => { debug('worker polling ' + queue); });
worker.on('job', (queue, job) => { debug('working job ' + queue + ' ' + JSON.stringify(job)); });
worker.on('reEnqueue', (queue, job, plugin) => { debug('reEnqueue job (' + plugin + ') ' + queue + ' ' + JSON.stringify(job)); });
worker.on('success', (queue, job, result) => { debug('job success ' + queue + ' ' + JSON.stringify(job) + ' >> ' + result); });
worker.on('failure', (queue, job, failure) => { debug('job failure ' + queue + ' ' + JSON.stringify(job) + ' >> ' + failure); });
worker.on('error', (queue, job, error) => { debug('error ' + queue + ' ' + JSON.stringify(job) + ' >> ' + error); });
worker.on('pause', () => { debug('worker paused'); });

scheduler.on('start', () => { debug('scheduler started'); });
scheduler.on('end', () => { debug('scheduler ended'); });
scheduler.on('poll', () => { debug('scheduler polling'); });
scheduler.on('master', (state) => { debug('scheduler became master'); });
scheduler.on('error', (error) => { debug('scheduler error >> ' + error); });
scheduler.on('working_timestamp', (timestamp) => { debug('scheduler working timestamp ' + timestamp); });
scheduler.on('transferred_job', (timestamp, job) => { debug('scheduler enquing job ' + timestamp + ' >> ' + JSON.stringify(job)); });

// CONNECT TO A QUEUE //

const queue = new NR.queue({connection: connectionDetails}, jobs);
queue.on('error', (error) => { debug(error); });
queue.connect(() => {
  queue.enqueue('math', 'add', [1, 2]);
  queue.enqueue('math', 'add', [1, 2]);
  queue.enqueue('math', 'add', [2, 3]);
  queue.enqueueIn(3000, 'math', 'subtract', [2, 1]);
  jobsToComplete = 4;
});

const shutdown = () => {
  if (jobsToComplete === 0) {
    setTimeout(() => {
      scheduler.end(() => {
        worker.end(() => {
          process.exit();
        });
      });
    }, 500);
  }
};

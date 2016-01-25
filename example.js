import debugLib from 'debug';
const debug = debugLib('app:example');

import { scheduler as Scheduler, queue as Queue } from 'node-resque';
import jobs from './server/jobs';
import worker from './server/worker';

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

const scheduler = new Scheduler({connection: connectionDetails});
scheduler.connect(() => {
  scheduler.start();
});

// REGESTER FOR EVENTS //

scheduler.on('start', () => { debug('scheduler started'); });
scheduler.on('end', () => { debug('scheduler ended'); });
scheduler.on('poll', () => { debug('scheduler polling'); });
scheduler.on('master', (state) => { debug('scheduler became master'); });
scheduler.on('error', (error) => { debug('scheduler error >> ' + error); });
scheduler.on('working_timestamp', (timestamp) => { debug('scheduler working timestamp ' + timestamp); });
scheduler.on('transferred_job', (timestamp, job) => { debug('scheduler enquing job ' + timestamp + ' >> ' + JSON.stringify(job)); });

worker(4, connectionDetails, ['math', 'otherQueue'], scheduler, jobs, () => {
  process.exit();
});

const queue = new Queue({connection: connectionDetails}, jobs);
queue.on('error', (error) => { debug(error); });
queue.connect(() => {
  queue.enqueue('math', 'add', [1, 2]);
  queue.enqueue('math', 'add', [1, 2]);
  queue.enqueue('math', 'add', [2, 3]);
  queue.enqueueIn(3000, 'math', 'subtract', [2, 1]);
});

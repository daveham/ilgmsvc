import _debug from 'debug';
const debug = _debug('svc:test');

import jobs from 'jobs';
import startWorker from 'worker';
import startScheduler from 'scheduler';
import startClient from 'client';

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

export default () => {
  debug('starting client');
  startClient(connectionDetails, jobs, (count) => {
    debug('starting scheduler');
    startScheduler(connectionDetails, (scheduler) => {
      debug('starting worker');
      startWorker(connectionDetails, ['math', 'otherQueue'], scheduler, jobs, count, () => {
        debug('test has completed');
        // process.exit();
      });
    });
  });
};

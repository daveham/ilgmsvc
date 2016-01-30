import _debug from 'debug';
const debug = _debug('svc:scheduler');

import { scheduler as Scheduler } from 'node-resque';

const start = (connection, cb) => {
  const scheduler = new Scheduler({ connection });

  scheduler.on('start', () => { debug('started'); });
  scheduler.on('end', () => { debug('ended'); });
  scheduler.on('poll', () => { debug('polling'); });
  scheduler.on('master', (state) => { debug('became master'); });
  scheduler.on('error', (error) => { debug(`error >> ${error}`); });
  scheduler.on('working_timestamp', (timestamp) => { debug(`working timestamp ${timestamp}`); });
  scheduler.on('transferred_job', (timestamp, job) => { debug(`transferred job ${timestamp} >> ${JSON.stringify(job)}`); });

  scheduler.connect(() => {
    scheduler.start();
    cb(scheduler);
  });

};

export default start;

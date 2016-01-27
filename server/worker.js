import debugLib from 'debug';
const debug = debugLib('app:worker');

import { worker as Worker } from 'node-resque';

const start = (connection, queues, scheduler, jobs, jobCount, cb) => {
  let jobsToComplete = jobCount;

  const worker = new Worker({connection, queues}, jobs);

  const shutdown = () => {
    if (jobsToComplete <= 0) {
      setTimeout(() => {
        scheduler.end(() => {
          worker.end(() => {
            cb();
          });
        });
      }, 500);
    }
  };

  worker.on('start', () => { debug('started'); });
  worker.on('end', () => { debug('ended'); });
  worker.on('cleaning_worker', (worker, pid) => { debug(`cleaning old worker ${worker}`); });
  worker.on('poll', (queue) => { debug(`polling ${queue}`); });
  worker.on('job', (queue, job) => { debug(`job ${queue} ${JSON.stringify(job)}`); });
  worker.on('reEnqueue', (queue, job, plugin) => { debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`); });

  worker.on('success',
    (queue, job, result) => {
      debug(`job success ${queue} ${JSON.stringify(job)} >> ${result}`);
      jobsToComplete--;
      shutdown();
    }
  );

  worker.on('failure',
    (queue, job, failure) => {
      debug(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`);
      jobsToComplete--;
      shutdown();
    }
  );

  worker.on('error', (queue, job, error) => { debug(`error ${queue} ${JSON.stringify(job)} >> ${error}`); });
  worker.on('pause', () => { debug('paused'); });

  worker.connect(() => {
    worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
    worker.start();
  });
};

export default start;

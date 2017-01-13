import _debug from 'debug';
const debug = _debug('svc:task-service:worker');

import { worker as Worker } from 'node-resque';

const start = (connection, queues, jobs, cb) => {
  const worker = new Worker({connection, queues}, jobs);

  worker.on('start',
    () => {
      debug('started');
    }
  );

  // worker.on('pause',
  //   () => {
  //     debug('paused');
  //   }
  // );

  worker.on('end',
    () => {
      debug('ended');
    }
  );

  worker.on('error',
    (queue, job, error) => {
      debug(`error ${queue} ${JSON.stringify(job)} >> ${error}`);
    }
  );

  worker.on('cleaning_worker',
    (worker, pid) => {
      debug(`cleaning old worker ${worker}`);
    }
  );

  // worker.on('poll', (queue) => { debug(`polling ${queue}`); });

  worker.on('job',
    (queue, job) => {
      debug(`${job.queue}/${job.class}`);
    }
  );

  worker.on('reEnqueue',
    (queue, job, plugin) => {
      debug(`reEnqueue job (${plugin}) ${queue} ${JSON.stringify(job)}`);
    }
  );

  worker.on('success',
    (queue, job, result) => {
      debug(`${job.queue}/${job.class} success`);
    }
  );

  worker.on('failure',
    (queue, job, failure) => {
      debug(`job failure ${queue} ${JSON.stringify(job)} >> ${failure}`);
    }
  );

  worker.connect(() => {
    worker.workerCleanup(); // optional: cleanup any previous improperly shutdown workers on this host
    worker.start();
    cb(worker);
  });
};

export default start;

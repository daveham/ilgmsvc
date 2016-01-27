import jobs from './server/jobs';
import startWorker from './server/worker';
import startScheduler from './server/scheduler';
import startClient from './server/client';

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

startClient(connectionDetails, jobs, (count) => {
  startScheduler(connectionDetails, (scheduler) => {
    startWorker(connectionDetails, ['math', 'otherQueue'], scheduler, jobs, count, () => {
      process.exit();
    });
  });
});

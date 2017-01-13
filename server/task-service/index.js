import jobs from './jobs';
import startWorker from './worker';

const connectionDetails = {
  pkg: 'ioredis',
  host: '127.0.0.1',
  password: null,
  port: 6379,
  database: 0
};

const start = cb => {
  startWorker(connectionDetails, ['il'], jobs, cb);
};

export default start;

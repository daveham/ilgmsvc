import debugLib from 'debug';
const debug = debugLib('app:client');

import { queue as Queue } from 'node-resque';

const start = (connection, jobs, cb) => {
  const queue = new Queue({ connection }, jobs);
  queue.on('error', (error) => { debug(error); });
  queue.connect(() => {
    queue.enqueue('math', 'add', [1, 2]);
    queue.enqueue('math', 'add', [1, 3]);
    queue.enqueue('math', 'add', [1, 4]);
    queue.enqueueIn(10000, 'math', 'subtract', [5, 2]);
    queue.enqueueIn(17000, 'math', 'add', [6, 7]);
    cb(5);
  });
};

export default start;

import app from 'app';

import _debug from 'debug';
const debug = _debug('svc:jobs');

const jobs = {
  add: {
//    plugins: [ 'jobLock' ],
//    pluginOptions: {
//      jobLock: {}
//    },
    perform: (a, b, callback) => {
      debug('job add perform');
      if (app) {
        const socket = app.get('socket');
        socket.emit('il-pong', { status: 'task complete' });
      }

      setTimeout(() => {
        callback(null, a + b);
      }, 1000);
    }
  },
  subtract: {
    perform: (a, b, callback) => {
      callback(null, a - b);
    }
  }
};

export default jobs;

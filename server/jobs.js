import app from 'app';

import _debug from 'debug';
const debug = _debug('svc:jobs');

const jobs = {
  ping: {
    perform: (callback) => {
      if (app) {
        const socket = app.get('socket');
        socket.emit('il-pong', { status: 'task complete' });
      }
      callback();
    }
  },
  add: {
    perform: (a, b, callback) => {
      debug('add');
      setTimeout(() => {
        callback(null, a + b);
      }, 1000);
    }
  },
  subtract: {
    perform: (a, b, callback) => {
      debug('subtract');
      callback(null, a - b);
    }
  }
};

export default jobs;

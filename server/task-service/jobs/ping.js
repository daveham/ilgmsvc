import app from 'app';

const defineJob = (jobs) => {
  jobs.ping = {
    perform: (cb) => {
      if (app) {
        const socket = app.get('socket');
        socket.emit('il-pong', { status: 'task complete' });
      }
      cb();
    }
  };
};

export default defineJob;
